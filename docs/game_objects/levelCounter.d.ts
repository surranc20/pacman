import { Container } from "pixi.js";
import { Fruits } from "../enums/fruits";
export default class LevelCounter {
    container: Container;
    fruits: Fruits[];
    constructor();
    setCounter(fruit: Fruits): void;
}
