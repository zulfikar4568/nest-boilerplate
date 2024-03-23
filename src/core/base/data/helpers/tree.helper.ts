import { TPrismaTx } from '../../domain/entities';
import { NodeTree, TEntityTree, Tree } from '../../domain/entities/tree.entity';

export class TreeHelper {
  private static async queryManyToDB<Entity extends NodeTree, Include>(
    entities: TEntityTree[],
    tx: TPrismaTx,
    entityName: string,
    include?: Include,
  ): Promise<Entity[]> {
    return await tx[entityName].findMany({
      where: {
        id: {
          in: entities.map((val) => val.id),
        },
      },
      include,
    });
  }

  /**
   * ## findRoots
   * This function is to used query the tree model from database.
   * The database will have id, parentId and name. in order to create a model tree into objects,
   * we need to query recusively. If you want to have the detail you can access this link
   * * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-recursive-query/
   * @param tx TPrismaTx
   * @param tableName string
   * @param entityName string
   * @param include Include (Prisma Include)
   * @returns Promise<Entity[]>
   */
  static async findRoots<Entity extends NodeTree, Include>(
    tx: TPrismaTx,
    tableName: string,
    entityName: string,
    include?: Include,
  ): Promise<Entity[]> {
    const entities = await tx.$queryRawUnsafe<TEntityTree[]>(`
        WITH RECURSIVE group_groups AS (
          SELECT 
            id, 
            "parentId", 
            name 
          FROM 
            "${tableName}"
          UNION 
          SELECT 
            r.id, 
            r."parentId", 
            r.name 
          FROM 
            "${tableName}" r 
            INNER JOIN group_groups g ON g.id = r."parentId"
        ) 
        SELECT * FROM group_groups;`);

    const data: Entity[] = await this.queryManyToDB(
      entities,
      tx,
      entityName,
      include,
    );
    const tree = new Tree<Entity>();

    return tree.buildTree(data);
  }

  /**
   * ## findDescendantsTree
   * This function is to used query the tree model from database.
   * The database will have id, parentId and name. in order to create a model tree into objects,
   * we need to query recusively. If you want to have the detail you can access this link
   * * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-recursive-query/
   * @param tx TPrismaTx
   * @param tableName string
   * @param id string
   * @param entityName string
   * @param include Include
   * @returns Promise<Entity | undefined>
   */
  static async findDescendantsTree<Entity extends NodeTree, Include>(
    tx: TPrismaTx,
    tableName: string,
    id: string,
    entityName: string,
    include?: Include,
  ): Promise<Entity | undefined> {
    const entities = await tx.$queryRawUnsafe<TEntityTree[]>(`
        WITH RECURSIVE group_groups AS (
          SELECT 
            id, 
            "parentId", 
            name 
          FROM 
            "${tableName}"
          WHERE
            id = '${id}'
          UNION 
          SELECT 
            r.id, 
            r."parentId", 
            r.name 
          FROM 
            "${tableName}" r 
            INNER JOIN group_groups g ON g.id = r."parentId"
        ) 
        SELECT * FROM group_groups;`);

    const data: Entity[] = await this.queryManyToDB(
      entities,
      tx,
      entityName,
      include,
    );
    const tree = new Tree<Entity>();

    return tree.buildTree(data).find((tree) => tree.id === id);
  }

  /**
   * ## findTrees
   * This function is to used query the tree model from database.
   * The database will have id, parentId and name. in order to create a model tree into objects,
   * we need to query recusively. If you want to have the detail you can access this link
   * * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-recursive-query/
   * @param tx TPrismaTx
   * @param tableName string
   * @param entityName string
   * @param include Include (Prisma Include)
   * @returns Promise<Entity[]>
   */
  static async findTrees<Entity extends NodeTree, Include>(
    tx: TPrismaTx,
    tableName: string,
    entityName: string,
    include?: Include,
  ): Promise<Entity[]> {
    const entities = await tx.$queryRawUnsafe<TEntityTree[]>(`
        WITH RECURSIVE group_groups AS (
          SELECT 
            id, 
            "parentId", 
            name 
          FROM 
            "${tableName}"
          UNION 
          SELECT 
            r.id, 
            r."parentId", 
            r.name 
          FROM 
            "${tableName}" r 
            INNER JOIN group_groups g ON g.id = r."parentId"
        ) 
        SELECT * FROM group_groups;`);

    const data: Entity[] = await this.queryManyToDB(
      entities,
      tx,
      entityName,
      include,
    );

    const tree = new Tree<Entity>();

    return tree.buildTree(data);
  }
}
