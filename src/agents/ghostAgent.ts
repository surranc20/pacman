import { Cardinal, CardinalOpposites } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import Keyboard from "pixi.js-keyboard";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";
import Moveable from "../abstract/moveable";
import { euclideanDistance } from "../utils/ghostTargetingAlgorithms";

export default class GhostAgent implements IAgent {
  keyboard = Keyboard;
  queuedMove = Cardinal.WEST;
  targetAI: (mazeModel: MazeModel, gameObj: Moveable) => MazeNode;

  constructor(targetAI: (MazeModel: MazeModel, gameObj: Moveable) => MazeNode) {
    this.targetAI = targetAI;
  }

  getMove(maze: MazeModel, gameObj: Moveable) {
    const targetNode = this.targetAI(maze, gameObj);
    return this._goToTargetNode(targetNode, gameObj.facing, gameObj.mazeNode);
  }

  //TODO: This can be fairly easily cleaned up / optimized
  // Go through directions in reverse priority and no longer need switch
  _goToTargetNode(
    targetNode: MazeNode,
    previousDir: Cardinal,
    currentNode: MazeNode
  ) {
    if (currentNode.connections.length === 1) {
      return previousDir;
    }

    const [tarX, tarY] = [targetNode.x, targetNode.y];
    let bestDir = new Set<Cardinal>([previousDir]);
    let bestDist = Infinity;
    for (const node of currentNode.connections) {
      const [x, y] = [node.x, node.y];
      const distanceToTarget = euclideanDistance(x, tarX, y, tarY);

      if (distanceToTarget <= bestDist) {
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
          if (distanceToTarget === bestDist) {
            bestDir.add(dir);
          } else {
            bestDir = new Set([dir]);
          }
          bestDist = distanceToTarget;
        }
      }
    }
    return this._handleTies(bestDir);
  }

  _handleTies(directions: any) {
    if (directions.length === 1) {
      return directions[0];
    }
    if (directions.has(Cardinal.NORTH)) return Cardinal.NORTH;
    if (directions.has(Cardinal.WEST)) return Cardinal.WEST;
    if (directions.has(Cardinal.SOUTH)) return Cardinal.SOUTH;
    return Cardinal.EAST;
  }
}
