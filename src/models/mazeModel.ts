import MazeNode from "./mazeNode";
import mapJson from "./map.json";
import Pacman from "../game_objects/pacman";

export default class MazeModel {
  nodes: Map<string, MazeNode>;
  pacman: Pacman;

  constructor(pacman: Pacman) {
    this.nodes = new Map<string, MazeNode>();
    this.setupMazeNodes();

    this.pacman = pacman;
    this.pacman.mazeNode = this.nodes.get([14, 23].toString())!;
    console.log(
      this.pacman.mazeNode.centerInNode(
        this.pacman.centerX,
        this.pacman.centerY
      )
    );
  }

  update(elapsedTime: number) {
    this.pacman.inputMove(this);
    this.pacman.update(elapsedTime);
  }

  setupMazeNodes() {
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

    for (const node of this.nodes.values()) {
      node.setupCardinalDirectionHelpers();
    }

    // Setup the two warp nodes
    const warpOne = this.nodes.get([0, 14].toString())!;
    const warpTwo = this.nodes.get([27, 14].toString())!;

    warpOne.connections.push(warpTwo);
    warpTwo.connections.push(warpOne);

    warpOne.west = warpTwo;
    warpTwo.east = warpOne;

    warpOne.warp = true;
    warpTwo.warp = true;
  }
}
