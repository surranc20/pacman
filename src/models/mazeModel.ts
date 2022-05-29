import MazeNode from "./mazeNode";
import mapJson from "./map.json";
import Pacman from "../game_objects/pacman";
import PelletFactory from "../utils/pelletFactory";
import { Container } from "pixi.js";
import Ghost from "../game_objects/ghost";
import GhostJail from "./ghostJail";
import powerPelletJson from "../utils/powerPellets.json";
import { positions } from "../enums/positions";
import { Constants } from "../enums/constants";

export default class MazeModel {
  nodes: Map<string, MazeNode>;
  pacman: Pacman;
  pelletContainer: Container;
  red!: Ghost;
  pink!: Ghost;
  blue!: Ghost;
  orange!: Ghost;
  ghostJail: GhostJail;

  constructor(pacman: Pacman, pelletContainer: Container) {
    this.nodes = new Map<string, MazeNode>();
    this.pelletContainer = pelletContainer;
    this.setupMazeNodes();
    this.pacman = pacman;

    const [startXTile, startYTile] = positions.startingPacmanTiles;
    this.pacman.mazeNode = this.getNode(startXTile, startYTile);
    this.pacman.previousMazeNode = this.getNode(startXTile, startYTile);
    this.ghostJail = new GhostJail([], this);
  }

  update(elapsedTime: number) {
    this.pacman.inputMove(this);
    this.pacman.update(elapsedTime);
    if (this.pacman.dying) return;

    this.red.update(elapsedTime);
    this.blue.update(elapsedTime);
    this.orange.update(elapsedTime);
    this.pink.update(elapsedTime);

    // update power pellet tiles
    for (const [x, y] of powerPelletJson.powerPellets) {
      this.getNode(x, y).update(elapsedTime);
    }
    this.ghostJail.update(elapsedTime);
  }

  setupMazeNodes() {
    // Get map valid path from json file
    const map = mapJson.map;
    // Add maze tiles to nodes
    for (let x = 0; x <= Constants.MAZE_X_SIZE; x++) {
      for (let y = 0; y <= Constants.MAZE_Y_SIZE; y++) {
        const newNode = new MazeNode(x, y, !!map[y][x]);
        this.nodes.set([x, y].toString(), newNode);
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
        const connection = this.getNode(newX, newY);

        if (connection?.validPath) {
          node.connections.push(connection);
        }
      }
    }
    for (const node of this.nodes.values()) {
      node.setupCardinalDirectionHelpers();
    }

    // Setup the two warp nodes
    let [x, y] = positions.warpLeftTile;
    const warpOne = this.getNode(x, y);

    [x, y] = positions.warpRightTile;
    const warpTwo = this.getNode(x, y);

    warpOne.connections.push(warpTwo);
    warpTwo.connections.push(warpOne);

    warpOne.west = warpTwo;
    warpTwo.east = warpOne;

    warpOne.warp = true;
    warpTwo.warp = true;

    this.resetPellets();
  }

  getNode(x: number, y: number) {
    const node = this.nodes.get([x, y].toString())!;
    return node;
  }

  getGhosts() {
    return [this.blue, this.orange, this.red, this.pink];
  }

  resetPellets() {
    this.pelletContainer.removeChildren();
    const pelletFactory = new PelletFactory();
    for (let x = 0; x <= Constants.MAZE_X_SIZE; x++) {
      for (let y = 0; y <= Constants.MAZE_Y_SIZE; y++) {
        const node = this.getNode(x, y);
        node.pellet = pelletFactory.createPelletForMazeNode(
          node,
          this.pelletContainer
        );
      }
    }
  }
}
