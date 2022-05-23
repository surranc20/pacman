import { Cardinal } from "../enums/cardinal";
import iAgent from "../interfaces/iAgent";
import IMoveable from "../interfaces/iMoveable";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";
import Animatable from "./animatable";
export default abstract class Moveable extends Animatable implements IMoveable {
    abstract agent: iAgent;
    abstract facing: Cardinal;
    abstract queuedMove: Cardinal;
    abstract mazeNode: MazeNode;
    speedBoostWhenTurning: boolean;
    defaultSpeedModifier: number;
    speedModifier: number;
    frightSpeed: number;
    abstract _hitWall(): boolean;
    update(elapsedTime: number): void;
    inputMove(maze: MazeModel): void;
    _continueInCurrentDir(): void;
    _corneringCase(): boolean;
    _applyBoost(): void;
    _centerAfterTurning(): void;
    _getUpdatedMazeNode(): void;
    _handleWarpScenario(old_node: MazeNode): void;
}
