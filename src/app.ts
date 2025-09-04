import { autoDetectRenderer } from "pixi.js";
import { Constants } from "./enums/constants";
import GameManager from "./utils/gameManager";
import { debouncedResize } from "./utils/helpers";

// Setup Pixi
const scale = 2;

const renderer = autoDetectRenderer({
  width: Constants.RESOLUTION_X,
  height: Constants.RESOLUTION_Y,
});
renderer.resize(Constants.RESOLUTION_X * scale, Constants.RESOLUTION_Y * scale);
document.body.appendChild(renderer.view);
window.onresize = debouncedResize;


// Create Game Manager and Game Ticker
const gameManager = new GameManager(renderer, scale);
gameManager.loadGame();
