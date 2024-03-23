import { TPrismaTx } from '../domain/entities';
import {
  DirectedGraphHierarchy,
  TEdge,
  TPath,
} from '../domain/entities/graph.entity';
import { BadRequestException } from '../frameworks/shared/exceptions/common.exception';
import { CyclicException } from '../frameworks/shared/exceptions/graph.exception';
import { camelize } from '../frameworks/shared/utils/string.util';
import { GraphHelper } from './helpers';

export class BaseGraphRepository<
  Entity extends Record<string, any>,
  Include extends Record<string, any>,
  Where extends Record<string, any>,
> {
  protected _entity: string;
  protected _tableName: string;

  public defaultInclude: Include;
  public defaultWhere: Where;

  constructor(entity: new () => Entity) {
    this._entity = camelize(entity.name.substring(5));
    this._tableName = `_${entity.name.substring(5)}Groups`;
  }

  /**
   * ## buildGraph
   * This function builds the graph hierarchy of this entity which are defined from generic **Entity**.
   * there's no filter entities which will be generate a paths then into hierarchy.
   * **Carefully to used this function it may affect performance!. Because generate all path it same as looping through all data.**
   * @param tx TPrismaTx
   * @param include Include
   * @returns Promise<DirectedGraphHierarchy<Entity>>
   */
  public async buildGraph(
    tx: TPrismaTx,
    include?: Include,
  ): Promise<DirectedGraphHierarchy<Entity>> {
    const graph = new DirectedGraphHierarchy<Entity>((n: Entity) => n.id);

    const edges: TEdge[] = await GraphHelper.findEdges(tx, this._tableName);

    const nodes: Entity[] = await tx[this._entity].findMany({
      include,
    });

    nodes.forEach((node) => {
      graph.insert(node);
    });

    edges.forEach((edge) => {
      graph.addEdge(edge.A, edge.B);
    });

    return graph;
  }

  /**
   * ## buildGraphHierarchyFromId
   * This function builds the graph hierarchy of this entity which are defined from generic **Entity**.
   * fromId is required to filter only specific path that we want to generate paths then into hierarchy
   * @param tx TPrismaTx
   * @param fromId string
   * @param include Include
   * @returns Promise<DirectedGraphHierarchy<Entity>>
   */
  public async buildGraphHierarchyFromId(
    tx: TPrismaTx,
    fromId: string,
    include?: Include,
  ): Promise<DirectedGraphHierarchy<Entity>> {
    const graph = await this.buildGraph(tx, include);

    const path: TPath[] = await GraphHelper.findPathByFromId(
      tx,
      this._tableName,
      fromId,
    );

    const collectionOfNodeIdentity = path.map((path) => path.path);
    graph.createHierarchy(collectionOfNodeIdentity);
    return graph;
  }

  /**
   * ## createNewBodyForCreate<T>
   * We need to transform body request into prisma format
   * @param body any
   * @param groupsFieldName string
   * @param entriesFieldName string
   * @returns T
   */
  public createNewBodyForCreate<T>(
    body: any,
    groupsFieldName: string,
    entriesFieldName: string,
  ): T {
    body[groupsFieldName] = {
      connect: body[groupsFieldName].map((groupId: string) => ({
        id: groupId,
      })),
    };

    body[entriesFieldName] = {
      createMany: {
        data: body[entriesFieldName].map((roleId: string) => ({
          roleId: roleId,
        })),
      },
    };

    return body;
  }

  /**
   * ## createNewBodyForUpdate<T>
   * We need to transform body request into prisma format
   * @param tx TPrismaTx
   * @param body any
   * @param id string
   * @param groupsFieldName string
   * @param entriesFieldName string
   * @returns Promise<T>
   */
  public async createNewBodyForUpdate<T>(
    tx: TPrismaTx,
    body: any,
    id: string,
    groupsFieldName: string,
    entriesFieldName: string,
  ): Promise<T> {
    // Build the graph first
    const graph = await this.buildGraphHierarchyFromId(tx, id);

    if (body[groupsFieldName]) {
      /**
       * Check and return the existing groups
       */
      const existingGroups = this.checkCyclicForUpdateOperation(
        id,
        body[groupsFieldName],
        graph,
      );

      body[groupsFieldName] = {
        // Remove all existing groups
        disconnect: existingGroups.map((groupId) => ({
          id: groupId,
        })),
        // Connect a new groups
        connect: body[groupsFieldName].map((groupId) => ({
          id: groupId,
        })),
      };
    }

    if (body[entriesFieldName]) {
      body[entriesFieldName] = {
        deleteMany: {},
        createMany: {
          data: body[entriesFieldName].map((roleId) => ({
            roleId: roleId,
          })),
        },
      };
    }

    return body;
  }

  /**
   * ## checkCyclicForUpdateOperation
   * This method is to check if the candidate groups will contain cyclic or not.
   * @param id string
   * @param groupIds string[] | undefined
   * @param graph DirectedGraphHierarchy<Entity>
   * @returns string[]
   */
  public checkCyclicForUpdateOperation(
    id: string,
    groupIds: string[] | undefined,
    graph: DirectedGraphHierarchy<Entity>,
  ): string[] {
    const parentNode = graph.getNode(id);

    if (!parentNode) {
      throw new BadRequestException({
        message: `id with ${id} does not exist!`,
      });
    }

    /**
     * Subtract parentGroupIds - body.groupIds.
     * Purpose is to create candidate id
     */
    const substractGroupIds = groupIds?.filter(
      (value) => !parentNode.groups.map((group) => group.id).includes(value),
    );

    /**
     * Add the list of groupsId that it will be groups or children.
     * We need to put candidate groups into the edge, so we can check whether this id contain cyclic!
     */
    substractGroupIds?.forEach((groupId) => {
      graph.addEdge(id, groupId);
    });

    /**
     * Check whether is data cyclic!. because cyclic can cause circular references!
     */
    if (!graph.isAcyclic()) {
      throw new CyclicException({
        message: 'the candidate groups contain cyclic!',
      });
    }

    /**
     * Return existing groups
     */
    return parentNode.groups.map((group) => group.id);
  }
}
