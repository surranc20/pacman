import { Container } from "pixi.js";
import Pellet from "../game_objects/pellet";
import MazeNode from "../models/mazeNode";

export default class PelletFactory {
  static noPelletTiles = new Set<string>([]);
  createPelletForMazeNode(mazeNode: MazeNode, pelletContainer: Container) {
    if (
      !mazeNode.validPath ||
      PelletFactory.noPelletTiles.has([mazeNode.x, mazeNode.y].toString())
    ) {
      return null;
    }
    const newPellet = new Pellet(mazeNode.center[0], mazeNode.center[1]);
    pelletContainer.addChild(newPellet);
    return newPellet;
  }
}
