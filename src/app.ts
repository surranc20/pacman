import { autoDetectRenderer } from "pixi.js";
import { Constants } from "./enums/constants";
import GameManager from "./utils/gameManager";
import { calculateScale, debouncedResize } from "./utils/helpers";

// Setup Pixi
const scale = calculateScale(document.body);

const renderer = autoDetectRenderer({
  width: Constants.RESOLUTION_X,
  height: Constants.RESOLUTION_Y,
});
renderer.resize(Constants.RESOLUTION_X * scale, Constants.RESOLUTION_Y * scale);
document.body.appendChild(renderer.view);

// Create Game Manager and Game Ticker
const gameManager = new GameManager(renderer, scale);
window.onresize = () => debouncedResize(gameManager);
gameManager.loadGame();
