import { Container } from "pixi.js";
import Pellet from "../game_objects/pellet";
import PowerPellet from "../game_objects/powerPellet";
import MazeNode from "../models/mazeNode";
import pelletJson from "./pellets.json";
import powerPelletJson from "./powerPellets.json";

export default class PelletFactory {
  static noPelletTilesSet = new Set(
    pelletJson.noPellets.map((pos) => pos.toString())
  );

  static powerPelletTilesSet = new Set(
    powerPelletJson.powerPellets.map((pos) => pos.toString())
  );

  createPelletForMazeNode(mazeNode: MazeNode, pelletContainer: Container) {
    if (
      !mazeNode.validPath ||
      PelletFactory.noPelletTilesSet.has([mazeNode.x, mazeNode.y].toString())
    ) {
      return null;
    }

    let newPellet = null;
    if (
      PelletFactory.powerPelletTilesSet.has([mazeNode.x, mazeNode.y].toString())
    ) {
      newPellet = new PowerPellet(mazeNode.center[0], mazeNode.center[1] - 1);
    } else {
      newPellet = new Pellet(mazeNode.center[0], mazeNode.center[1] - 1);
    }

    pelletContainer.addChild(newPellet);
    return newPellet;
  }
}
