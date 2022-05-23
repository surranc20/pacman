import Pacman from "../game_objects/pacman";
import Pellet from "../game_objects/pellet";
export default class MazeNode {
    x: number;
    y: number;
    validPath: any;
    connections: MazeNode[];
    gameObject: Pacman | any;
    pellet: Pellet | null;
    east: MazeNode;
    south: MazeNode;
    north: MazeNode;
    west: MazeNode;
    warp: boolean;
    constructor(x: number, y: number, validPath: boolean);
    setupCardinalDirectionHelpers(): void;
    centerInNode(centerX: number, centerY: number): boolean;
    get center(): number[];
}
