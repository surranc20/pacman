import { Container } from "pixi.js";
import ScoreDisplayer from "./scoreDisplayer";
export default class HighScore {
    container: Container;
    score: number;
    titleContainer: Container;
    scoreDisplayer: ScoreDisplayer;
    constructor();
    updateScoreBoard(points: number): void;
}
