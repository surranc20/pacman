import { Cardinal, CardinalOpposites } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import Keyboard from "pixi.js-keyboard";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";

export default class GhostAgent implements IAgent {
  keyboard = Keyboard;
  queuedMove = Cardinal.WEST;

  getMove(maze: MazeModel, previousDir: Cardinal, currentNode: MazeNode) {
    const targetNode = this.getTargetBlinky(maze);
    return this._goToTargetNode(targetNode, previousDir, currentNode);
  }

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
      const distanceToTarget = this.euclideanDistance(x, tarX, y, tarY);

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

  getTargetBlinky(maze: MazeModel) {
    return maze.pacman.mazeNode;
  }

  getTargetPinky(maze: MazeModel) {
    let [x, y] = [maze.pacman.mazeNode.x, maze.pacman.mazeNode.y];
    [x, y] = this.getGhostOffset(x, y, 4, maze.pacman.facing);
    return maze.nodes.get([x, y].toString())!;
  }

  getTargetClyde(maze: MazeModel, currentNode: MazeNode) {
    const [x1, y1] = [currentNode.x, currentNode.y];
    const [x2, y2] = [maze.pacman.mazeNode.x, maze.pacman.mazeNode.y];
    const distanceToPacman = this.euclideanDistance(x1, x2, y1, y2);

    if (distanceToPacman >= 8) {
      return maze.pacman.mazeNode;
    }
    return maze.nodes.get([0, 27].toString())!;
  }

  getTargetInky(maze: MazeModel) {
    const pacmanNode = maze.pacman.mazeNode;
    const blinkyNode = maze.pacman.mazeNode;

    const [offsetX, offsetY] = this.getGhostOffset(
      pacmanNode.x,
      pacmanNode.y,
      2,
      maze.pacman.facing
    );

    const [vectorX, vectorY] = this.getVectorBetweenTwoNodes(
      blinkyNode,
      maze.nodes.get([offsetX, offsetY].toString())!
    );

    const [x, y] = [offsetX + vectorX, offsetY + vectorY];

    return maze.nodes.get([x, y].toString()!);
  }

  euclideanDistance(x1: number, x2: number, y1: number, y2: number) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  getGhostOffset(x: number, y: number, offset: number, dir: Cardinal) {
    switch (dir) {
      case Cardinal.NORTH:
        x -= offset;
        y -= offset;
        break;
      case Cardinal.SOUTH:
        y += offset;
        break;
      case Cardinal.WEST:
        x -= offset;
        break;
      case Cardinal.EAST:
        x += offset;
        break;
    }

    if (x < 0) x = 0;
    if (x > 27) x = 27;
    if (y < 0) y = 0;
    if (y > 30) y = 30;

    return [x, y];
  }

  // From node1 to node2
  getVectorBetweenTwoNodes(node1: MazeNode, node2: MazeNode) {
    const x = node2.x - node1.x;
    const y = node2.y - node1.y;

    return [x, y];
  }

  //TODO: Can optimize the need for set creation away if needed
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
