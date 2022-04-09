import { Container } from "pixi.js";

export default interface iScene {
  stage: Container;
  update: (elapsedTime: number) => void;
}
