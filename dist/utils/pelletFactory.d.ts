import { Container } from "pixi.js";
import Pellet from "../game_objects/pellet";
import PowerPellet from "../game_objects/powerPellet";
import MazeNode from "../models/mazeNode";
export default class PelletFactory {
    static noPelletTilesSet: Set<string>;
    static powerPelletTilesSet: Set<string>;
    createPelletForMazeNode(mazeNode: MazeNode, pelletContainer: Container): Pellet | PowerPellet | null;
}
