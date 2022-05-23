import { Cardinal } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import MazeModel from "../models/mazeModel";
import Moveable from "../abstract/moveable";
export default class PlayerAgent implements IAgent {
    keyboard: any;
    queuedMove: Cardinal;
    getMove(_maze: MazeModel, gameObj: Moveable): Cardinal;
    getValidMoves(): Cardinal[];
}
