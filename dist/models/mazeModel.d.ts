import MazeNode from "./mazeNode";
import Pacman from "../game_objects/pacman";
import { Container } from "pixi.js";
import Ghost from "../game_objects/ghost";
import GhostJail from "./ghostJail";
export default class MazeModel {
    nodes: Map<string, MazeNode>;
    pacman: Pacman;
    pelletContainer: Container;
    red: Ghost;
    pink: Ghost;
    blue: Ghost;
    orange: Ghost;
    ghostJail: GhostJail;
    constructor(pacman: Pacman, pelletContainer: Container);
    update(elapsedTime: number): void;
    setupMazeNodes(): void;
    getNode(x: number, y: number): MazeNode;
    getGhosts(): Ghost[];
    resetPellets(): void;
}
