import { DirectedGraph } from 'typescript-graph';

export type TEdge = { A: string; B: string };

export type TPath = TEdge & { path: string[] };

/**
 * ## DirectedGraphHierarchy<T>
 * This class is inherited from DirectedGraph, you can have more details about DirectedGraph
 * in here https://segfaultx64.github.io/typescript-graph/
 * The purpose of this class is to create sub trees of Directed Graph Acyclic
 */
export class DirectedGraphHierarchy<T> extends DirectedGraph<T> {
  /**
   * ## createHierarchy
   * This method is used to build the hierarchical of graph from path for example [[1, 2], [1, 3], [1, 2, 4], [1, 2, 5]]
   * @param collectionOfNodeIdentity string[][]
   */
  public createHierarchy(collectionOfNodeIdentity: string[][]) {
    // Loop the list of paths for example [[1, 2], [1, 3]]
    for (let i = 0; i < collectionOfNodeIdentity.length; i++) {
      // Loop the nodeId from paths for example first [1, 2] then [1, 3] for second
      for (let j = 0; j < collectionOfNodeIdentity[i].length; j++) {
        // Take the current node
        const currentNode: any = this.getNode(collectionOfNodeIdentity[i][j]);

        // Take the next node
        const nextNode: any = this.getNode(collectionOfNodeIdentity[i][j + 1]);

        // If currentNode exist, we need to make sure node have field groups
        if (currentNode) {
          if (currentNode.groups === undefined || currentNode.groups == null)
            currentNode.groups = [];
        }

        // If nextNode exists, then we push to field groups
        if (nextNode) {
          if (
            !currentNode.groups.find((node: any) => node.id === nextNode.id)
          ) {
            currentNode.groups.push(nextNode);
          }

          // Update the latest nodes into old nodes
          this.nodes.set(collectionOfNodeIdentity[i][j], currentNode);
        }
      }
    }
  }
}
