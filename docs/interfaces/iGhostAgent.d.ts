import Moveable from "../abstract/moveable";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";
import IAgent from "./iAgent";
export default interface IGhostAgent extends IAgent {
    targetAI: (mazeModel: MazeModel, gameObj: Moveable) => MazeNode;
    defaultTargetAI: (mazeModel: MazeModel, gameObj: Moveable) => MazeNode;
}
