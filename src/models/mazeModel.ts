import MazeNode from "./mazeNode";
import mapJson from "./map.json";

export default class MazeModel {
  nodes: Map<string, MazeNode>;

  constructor() {
    this.nodes = new Map<string, MazeNode>();
    this.populateNodes();
    console.log(this.nodes);
  }

  populateNodes() {
    // Get map valid path from json file
    const map = mapJson.map;

    // Add maze tiles to nodes
    for (let x = 0; x < 28; x++) {
      for (let y = 0; y < 31; y++) {
        this.nodes.set([x, y].toString(), new MazeNode(x, y, !!map[y][x]));
      }
    }

    // Add valid connections for each node
    const directionDeltas = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const node of this.nodes.values()) {
      for (const delta of directionDeltas) {
        const [newX, newY] = [node.x + delta[0], node.y + delta[1]];
        const connection = this.nodes.get([newX, newY].toString());

        if (connection?.validPath) {
          node.connections.push(connection);
        }
      }
    }
  }
}
