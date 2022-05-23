import { AbstractRenderer } from "pixi.js";
import GameTicker from "./gameTicker";
import IScene from "../interfaces/iScene";
export default class GameManager {
    scene: IScene;
    gameTicker: GameTicker;
    keyboard: any;
    constructor(renderer: AbstractRenderer);
    update: (elapsedTime: number) => void;
    loadGame(): void;
}
