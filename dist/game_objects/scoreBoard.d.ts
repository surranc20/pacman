import { Container } from "pixi.js";
import ScoreDisplayer from "./scoreDisplayer";
export default class ScoreBoard {
    container: Container;
    score: number;
    oneUpContainer: Container;
    scoreDisplayer: ScoreDisplayer;
    fps: number;
    private _blinkTimer;
    blinking: boolean;
    constructor();
    update(elapsedTime: number): void;
    updateScoreBoard(points: number): void;
}
