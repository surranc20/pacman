import { Color } from "../enums/color";
import Ghost from "../game_objects/ghost";
import MazeModel from "./mazeModel";
export default class GhostJail {
    ghosts: Map<Ghost, number>;
    jailSlots: Map<number, Ghost | null>;
    priorityList: Color[];
    ghostDotCounter: Map<Color, number>;
    mazeModel: MazeModel;
    globalCounter: number;
    globalCounterActivated: boolean;
    globalDotThresholds: Map<number, Color>;
    defaultTimer: number;
    timer: number;
    ghostsRetreating: number;
    resumeFrightenedSirenCallback: () => void;
    constructor(ghosts: Array<Ghost>, mazeModel: MazeModel);
    sendToJail(ghost: Ghost): void;
    addGhost(ghost: Ghost): void;
    releaseGhost(ghost: Ghost): void;
    update(elapsedTime: number): void;
    dotEaten(): void;
    mapColorToGhost(color: Color): Ghost | undefined;
    clearJail(): void;
    addStartingGhosts(): void;
}
