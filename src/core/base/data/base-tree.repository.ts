import { TPrismaTx } from '../domain/entities';
import { camelize } from '../frameworks/shared/utils/string.util';
import { TreeHelper } from './helpers';
import { NodeTree } from '../domain/entities/tree.entity';

export abstract class BaseTreeRepository<
  Entity extends NodeTree,
  Include extends Record<string, any>,
  Where extends Record<string, any>,
> {
  protected _entity: string;
  protected _tableName: string;

  public defaultInclude: Include;
  public defaultWhere: Where;

  constructor(entity: new () => Entity) {
    this._entity = camelize(entity.name.substring(4));
    this._tableName = entity.name.substring(4);
  }

  /**
   * ## findRoots
   * This function is to used query the tree model from database.
   * The database will have id, parentId and name. in order to create a model tree into objects,
   * we need to query recusively. If you want to have the detail you can access this link
   * * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-recursive-query/
   * @param tx TPrismaTx
   * @param include Include
   * @returns Promise<Entity[]>
   */
  async findRoots(tx: TPrismaTx, include?: Include): Promise<Entity[]> {
    return TreeHelper.findRoots(tx, this._tableName, this._entity, include);
  }

  /**
   * ## findTrees
   * This function is to used query the tree model from database.
   * The database will have id, parentId and name. in order to create a model tree into objects,
   * we need to query recusively. If you want to have the detail you can access this link
   * * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-recursive-query/
   * @param tx TPrismaTx
   * @param include Include
   * @returns Promise<Entity[]>
   */
  async findTrees(tx: TPrismaTx, include?: Include): Promise<Entity[]> {
    return TreeHelper.findTrees(tx, this._tableName, this._entity, include);
  }

  /**
   * ## findDescendantsTree
   * This function is to used query the tree model from database.
   * The database will have id, parentId and name. in order to create a model tree into objects,
   * we need to query recusively. If you want to have the detail you can access this link
   * * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-recursive-query/
   * @param tx TPrismaTx
   * @param id string
   * @param include Include
   * @returns Promise<Entity | undefined>
   */
  async findDescendantsTree(
    tx: TPrismaTx,
    id: string,
    include?: Include,
  ): Promise<Entity | undefined> {
    return TreeHelper.findDescendantsTree(
      tx,
      this._tableName,
      id,
      this._entity,
      include,
    );
  }

  /**
   * ## createNewBodyForCreate<T>
   * @param body any
   * @param entriesFieldName string
   * @param parentFieldName string
   * @returns T
   */
  public createNewBodyForCreate<T>(
    body: any,
    entriesFieldName: string,
    parentFieldName: string,
  ): T {
    body[entriesFieldName] = {
      createMany: {
        data: body[entriesFieldName].map((roleId: string[]) => ({
          roleId: roleId,
        })),
      },
    };

    body[parentFieldName] = body.parentId
      ? {
          connect: {
            id: body.parentId,
          },
        }
      : undefined;

    return body;
  }

  /**
   * ## createNewBodyForUpdate<T>
   * @param body any
   * @param entriesFieldName string
   * @param parentFieldName string
   * @returns T
   */
  public createNewBodyForUpdate<T>(
    body: any,
    entriesFieldName: string,
    parentFieldName: string,
  ): T {
    if (body[entriesFieldName]) {
      body[entriesFieldName] = {
        deleteMany: {},
        createMany: {
          data: body[entriesFieldName].map((roleId: string) => ({
            roleId: roleId,
          })),
        },
      };
    }

    body[parentFieldName] = body.parentId
      ? {
          connect: {
            id: body.parentId,
          },
        }
      : { disconnect: {} };

    return body;
  }
}
