import { Cardinal, CardinalOpposites } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import Keyboard from "pixi.js-keyboard";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";

export default class GhostAgent implements IAgent {
  keyboard = Keyboard;
  queuedMove = Cardinal.WEST;

  getMove(maze: MazeModel, previousDir: Cardinal, currentNode: MazeNode) {
    const targetNode = maze.pacman.mazeNode;

    if (currentNode.connections.length === 1) {
      return previousDir;
    }

    const [tarX, tarY] = [targetNode.x, targetNode.y];
    let bestDir = previousDir;
    let bestDist = Infinity;
    for (const node of currentNode.connections) {
      const [x, y] = [node.x, node.y];
      const distanceToTarget = Math.sqrt((tarX - x) ** 2 + (tarY - y) ** 2);

      if (distanceToTarget < bestDist) {
        let dir = null;
        switch (true) {
          case node == currentNode.east:
            dir = Cardinal.EAST;
            break;
          case node == currentNode.west:
            dir = Cardinal.WEST;
            break;
          case node == currentNode.north:
            dir = Cardinal.NORTH;
            break;
          default:
            dir = Cardinal.SOUTH;
            break;
        }

        if (CardinalOpposites.get(dir) !== previousDir) {
          bestDist = distanceToTarget;
          bestDir = dir;
        }
      }
    }
    return bestDir;
  }
}
