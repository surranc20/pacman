import { Cardinal } from "../enums/cardinal";
import GameState from "../models/gameState";

export default interface IAgent {
  getMove: (state: GameState, previousDir: Cardinal) => Cardinal;
}
