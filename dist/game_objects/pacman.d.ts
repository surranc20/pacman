import PlayerAgent from "../agents/playerAgent";
import { Cardinal } from "../enums/cardinal";
import MazeNode from "../models/mazeNode";
import Moveable from "../abstract/moveable";
export default class Pacman extends Moveable {
    agent: PlayerAgent;
    facing: Cardinal;
    mazeNode: MazeNode;
    queuedMove: Cardinal;
    moveFrameDelay: number;
    pelletEatenCallback: () => void;
    powerPelletEatenCallback: () => void;
    munchNumber: number;
    eatFrames: any;
    deathFrames: any;
    dying: boolean;
    startDeathCallback: () => void;
    endDeathCallback: () => void;
    constructor(x: number, y: number);
    update(elapsedTime: number): void;
    die(): void;
    _hitWall(): boolean;
    _continueInCurrentDir(): void;
    _pacmanPastNodeCenter(): boolean;
}
