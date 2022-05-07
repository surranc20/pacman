import MazeNode from "./mazeNode";
import mapJson from "./map.json";
import Pacman from "../game_objects/pacman";
import PelletFactory from "../utils/pelletFactory";
import { Container } from "pixi.js";
import Ghost from "../game_objects/ghost";

export default class MazeModel {
  nodes: Map<string, MazeNode>;
  pacman: Pacman;
  pelletContainer: Container;
  red!: Ghost;
  pink!: Ghost;
  blue!: Ghost;
  orange!: Ghost;

  constructor(pacman: Pacman, pelletContainer: Container) {
    this.nodes = new Map<string, MazeNode>();
    this.pelletContainer = pelletContainer;
    this.setupMazeNodes();
    this.pacman = pacman;
    this.pacman.mazeNode = this.nodes.get([14, 23].toString())!;
  }

  update(elapsedTime: number) {
    this.pacman.inputMove(this);
    this.pacman.update(elapsedTime);
    this.red.update(elapsedTime);
    this.blue.update(elapsedTime);
    this.orange.update(elapsedTime);
    this.pink.update(elapsedTime);
  }

  setupMazeNodes() {
    // Get map valid path from json file
    const map = mapJson.map;
    const pelletFactory = new PelletFactory();

    // Add maze tiles to nodes
    for (let x = 0; x < 28; x++) {
      for (let y = 0; y < 31; y++) {
        const newNode = new MazeNode(x, y, !!map[y][x]);
        newNode.pellet = pelletFactory.createPelletForMazeNode(
          newNode,
          this.pelletContainer
        );
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
