import Moveable from "../abstract/moveable";
import { Cardinal } from "../enums/cardinal";
import { Constants } from "../enums/constants";
import { GoingToJailState } from "../enums/goingToJail";
import { ScatterTargets } from "../enums/scatterTargets";
import Ghost from "../game_objects/ghost";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";

export function getTargetFreightened(_maze: MazeModel, gameObj: Moveable) {
  const possibleNodes = gameObj.mazeNode.connections;
  return possibleNodes[Math.floor(Math.random() * possibleNodes.length)];
}

export function getTargetGoToJail(maze: MazeModel, gameObj: Moveable) {
  const [jailX, jailY] = maze.ghostJail.jailEntryTile;
  if (gameObj.mazeNode.x === jailX && gameObj.mazeNode.y === jailY) {
    const ghost = gameObj as Ghost;
    ghost.goingToJailState = GoingToJailState.X_CENTERING;
  }
  return maze.getNode(jailX, jailY);
}

export function getTargetBlinky(maze: MazeModel, _gameObj: Moveable) {
  return maze.pacman.mazeNode;
}

export function getTargetPinky(maze: MazeModel, _gameObj: Moveable) {
  let [x, y] = [maze.pacman.mazeNode.x, maze.pacman.mazeNode.y];
  [x, y] = getGhostOffset(
    x,
    y,
    Constants.PINKY_TARGET_OFFSET,
    maze.pacman.facing
  );
  return maze.getNode(x, y);
}

export function getTargetClyde(maze: MazeModel, gameObj: Moveable) {
  const currentNode = gameObj.mazeNode;
  const [x1, y1] = [currentNode.x, currentNode.y];
  const [x2, y2] = [maze.pacman.mazeNode.x, maze.pacman.mazeNode.y];
  const distanceToPacman = euclideanDistance(x1, x2, y1, y2);

  if (distanceToPacman >= Constants.CLYDE_RUN_AWAY_THRESHOLD) {
    return maze.pacman.mazeNode;
  }
  const [x, y] = [ScatterTargets.CLYDE_X, ScatterTargets.CLYDE_Y];
  return maze.getNode(x, y);
}

export function getTargetInky(maze: MazeModel, _gameObj: Moveable) {
  const pacmanNode = maze.pacman.mazeNode;
  const blinkyNode = maze.red.mazeNode;

  const [offsetX, offsetY] = getGhostOffset(
    pacmanNode.x,
    pacmanNode.y,
    Constants.INKY_PACMAN_TARGET_OFFSET,
    maze.pacman.facing
  );

  const [vectorX, vectorY] = getVectorBetweenTwoNodes(
    blinkyNode,
    maze.getNode(offsetX, offsetY)
  );

  let [x, y] = [offsetX + vectorX, offsetY + vectorY];
  [x, y] = normalizeCoords(x, y);
  return maze.getNode(x, y);
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

  [x, y] = normalizeCoords(x, y);
  return [x, y];
}

// From node1 to node2
function getVectorBetweenTwoNodes(node1: MazeNode, node2: MazeNode) {
  const x = node2.x - node1.x;
  const y = node2.y - node1.y;

  return [x, y];
}

function normalizeCoords(x: number, y: number) {
  if (x < 0) x = 0;
  if (x > Constants.MAZE_X_SIZE) x = Constants.MAZE_X_SIZE;
  if (y < 0) y = 0;
  if (y > Constants.MAZE_Y_SIZE) y = Constants.MAZE_Y_SIZE;
  return [x, y];
}
