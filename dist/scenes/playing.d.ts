import { Container, Loader } from "pixi.js";
import Stage from "../game_objects/stage";
import IScene from "../interfaces/iScene";
import GameState from "../models/gameState";
export default class Playing implements IScene {
    stage: Container;
    gameStage: Stage;
    gameState: GameState;
    introPlaying: boolean;
    intermissionPlaying: boolean;
    update(elapsedTime: number): void;
    addAssetsToLoader(loader: Loader): void;
    onDoneLoading(resources: any): void;
}
