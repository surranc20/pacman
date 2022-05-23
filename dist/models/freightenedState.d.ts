/// <reference types="node" />
import { Container } from "pixi.js";
import Ghost from "../game_objects/ghost";
import MazeModel from "./mazeModel";
export default class FreightendState {
    ghostsEaten: number;
    mazeModel: MazeModel;
    gameContainer: Container;
    updateScoreCallback: (points: number) => void;
    pointOptions: number[];
    active: boolean;
    restartSirenCallback: () => void;
    timeoutID: NodeJS.Timeout | null;
    frightTime: number;
    frightBlinkTime: number;
    constructor(mazeModel: MazeModel, gameContainer: Container, updateScoreCallback: (points: number) => void, restartSirenCallback: () => void);
    enterFreightendMode(): void;
    _freightenedAlmostDone(): void;
    _endFreightened(): void;
    ghostEatenCallback: (ghost: Ghost) => void;
    resumeFrightenedCallback: () => void;
    interruptedCleanup(): void;
}
