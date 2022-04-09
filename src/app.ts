import { autoDetectRenderer } from "pixi.js";
import GameManager from "./gameManager";

// Setup Pixi
const renderer = autoDetectRenderer({ width: 224, height: 288 });
document.body.appendChild(renderer.view);

// Create Game Manager and Game Ticker
const gameManager = new GameManager(renderer);
gameManager.loadGame();
