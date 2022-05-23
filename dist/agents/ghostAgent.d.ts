import { Cardinal } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";
import Moveable from "../abstract/moveable";
export default class GhostAgent implements IAgent {
    keyboard: any;
    queuedMove: Cardinal;
    targetAI: (mazeModel: MazeModel, gameObj: Moveable) => MazeNode;
    defaultTargetAI: (mazeModel: MazeModel, gameObj: Moveable) => MazeNode;
    constructor(targetAI: (MazeModel: MazeModel, gameObj: Moveable) => MazeNode);
    getMove(maze: MazeModel, gameObj: Moveable): any;
    _goToTargetNode(targetNode: MazeNode, previousDir: Cardinal, currentNode: MazeNode): any;
    _handleTies(directions: any): any;
}
