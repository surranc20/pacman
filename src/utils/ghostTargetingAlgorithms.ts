import Moveable from "../abstract/moveable";
import { Cardinal } from "../enums/cardinal";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";

export function getTargetGoToJail() {}

export function getTargetBlinky(maze: MazeModel, _gameObj: Moveable) {
  return maze.pacman.mazeNode;
}

export function getTargetPinky(maze: MazeModel, _gameObj: Moveable) {
  let [x, y] = [maze.pacman.mazeNode.x, maze.pacman.mazeNode.y];
  [x, y] = getGhostOffset(x, y, 4, maze.pacman.facing);
  return maze.nodes.get([x, y].toString())!;
}

export function getTargetClyde(maze: MazeModel, gameObj: Moveable) {
  const currentNode = gameObj.mazeNode;
  const [x1, y1] = [currentNode.x, currentNode.y];
  const [x2, y2] = [maze.pacman.mazeNode.x, maze.pacman.mazeNode.y];
  const distanceToPacman = euclideanDistance(x1, x2, y1, y2);

  if (distanceToPacman >= 8) {
    return maze.pacman.mazeNode;
  }
  return maze.nodes.get([0, 27].toString())!;
}

export function getTargetInky(maze: MazeModel, _gameObj: Moveable) {
  const pacmanNode = maze.pacman.mazeNode;
  const blinkyNode = maze.red.mazeNode;

  const [offsetX, offsetY] = getGhostOffset(
    pacmanNode.x,
    pacmanNode.y,
    2,
    maze.pacman.facing
  );

  const [vectorX, vectorY] = getVectorBetweenTwoNodes(
    blinkyNode,
    maze.nodes.get([offsetX, offsetY].toString())!
  );

  let [x, y] = [offsetX + vectorX, offsetY + vectorY];

  if (x < 0) x = 0;
  if (x > 27) x = 27;
  if (y < 0) y = 0;
  if (y > 30) y = 30;

  return maze.nodes.get([x, y].toString())!;
}

export function euclideanDistance(
  x1: number,
  x2: number,
  y1: number,
  y2: number
) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function getGhostOffset(x: number, y: number, offset: number, dir: Cardinal) {
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
function getVectorBetweenTwoNodes(node1: MazeNode, node2: MazeNode) {
  const x = node2.x - node1.x;
  const y = node2.y - node1.y;

  return [x, y];
}
