import { Container } from "pixi.js";
export default class LifeCounter {
    container: Container;
    lives: number;
    constructor(lives: number);
    setLives(lives: number): void;
}
