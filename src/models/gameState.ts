import IMoveable from "../interfaces/iMoveable";
import Pacman from "../game_objects/pacman";
import IAnimatable from "../interfaces/iAnimatable";

export default class GameState {
  movableObjects: IMoveable[];
  animatableObjects: IAnimatable[];

  constructor(pacman: Pacman) {
    this.movableObjects = [pacman];
    this.animatableObjects = [pacman];
  }

  update(elapsedTime: number) {
    for (const object of this.animatableObjects) {
      object.update(elapsedTime);
    }
    for (const object of this.movableObjects) {
      object.inputMove(this);
    }
  }
}
