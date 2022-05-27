import { autoDetectRenderer } from "pixi.js";
import GameManager from "./utils/gameManager";

// Setup Pixi
const scale = 2;

const renderer = autoDetectRenderer({ width: 224, height: 288 });
renderer.resize(224 * scale, 288 * scale);
document.body.appendChild(renderer.view);

// Create Game Manager and Game Ticker
const gameManager = new GameManager(renderer, scale);
gameManager.loadGame();
