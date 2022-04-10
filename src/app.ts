import { autoDetectRenderer } from "pixi.js";
import GameManager from "./utils/gameManager";

// Setup Pixi
const renderer = autoDetectRenderer({ width: 224, height: 288 });
document.body.appendChild(renderer.view);

// Create Game Manager and Game Ticker
const gameManager = new GameManager(renderer);
gameManager.loadGame();

renderer.resize(448, 576);
gameManager.scene.stage.scale.set(2);
