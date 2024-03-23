import { BaseEntity } from './base.entity';

export type TEntityTree = {
  id: string;
  parentId: string;
  name: string;
};

/**
 * ## NodeTree
 * Basic of shape Generic Tree structure
 * * https://www.geeksforgeeks.org/generic-treesn-array-trees/
 * where this node have one parent and have many children or groups
 */
export class NodeTree extends BaseEntity {
  groups: NodeTree[];
  parentId?: string | null;

  constructor(id: string, name: string, groups: NodeTree[], parentId?: string) {
    super();
    this.id = id;
    this.name = name;
    this.groups = groups;
    this.parentId = parentId;
  }
}

/**
 * ## Tree
 * We can use this class to create data into model Generic Tree Structure,
 * * https://www.geeksforgeeks.org/generic-treesn-array-trees/
 * There are two function that can be used in order to create list of a roots ***buildRoots()***
 * and generate list of trees ***buildTree()***
 */
export class Tree<Entity extends NodeTree> {
  public trees: Entity[] = [];
  public listOfRoots: Entity[] = [];

  private createNode(entity: Entity): Entity {
    entity.groups = [];
    return entity;
  }

  private fillEntities(entities: Entity[], node: NodeTree) {
    entities.forEach((entity) => {
      if (entity.parentId === node.id) {
        const group = node.groups.find(
          (group: NodeTree) => group.id === entity.id,
        );

        if (!group) {
          node.groups.push(this.createNode(entity));
        }
      }
    });
  }

  private fillTree(entities: Entity[], node: NodeTree): void {
    this.fillEntities(entities, node);

    if (node.groups.length > 0) {
      node.groups.forEach((group: NodeTree) => {
        this.fillEntities(entities, node);

        this.fillTree(entities, group);
      });
    }
  }

  /**
   * ## buildTree
   * This function is used to build a tree from entities,
   * where entities are getting from CTE recursive function postgresql,
   * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-recursive-query/
   * the entity of inherit from NodeTree
   * @param entities Entity[]
   * @returns Entity[]
   */
  public buildTree(entities: Entity[]): Entity[] {
    entities.forEach(async (entity) => {
      const root: Entity = this.createNode(entity);
      this.fillTree(entities, root);
      this.trees.push(root);
    });

    return this.trees;
  }

  /**
   * ## buildRoots
   * This function is used to build a list of roots from entities,
   * where entities are getting from CTE recursive function postgresql,
   * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-recursive-query/
   * the entity of inherit from NodeTree
   * @param entities Entity[]
   * @returns Entity[]
   */
  public buildRoots(entities: Entity[]): Entity[] {
    entities.forEach(async (entity) => {
      this.listOfRoots.push(entity);
    });

    return this.listOfRoots;
  }
}
