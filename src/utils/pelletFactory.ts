import { Container } from "pixi.js";
import Pellet from "../game_objects/pellet";
import MazeNode from "../models/mazeNode";
import pelletJson from "./pellets.json";

export default class PelletFactory {
  static noPelletTilesSet = new Set(
    pelletJson.noPellets.map((pos) => pos.toString())
  );

  createPelletForMazeNode(mazeNode: MazeNode, pelletContainer: Container) {
    if (
      !mazeNode.validPath ||
      PelletFactory.noPelletTilesSet.has([mazeNode.x, mazeNode.y].toString())
    ) {
      return null;
    }
    const newPellet = new Pellet(mazeNode.center[0], mazeNode.center[1] - 1);
    pelletContainer.addChild(newPellet);
    return newPellet;
  }
}
