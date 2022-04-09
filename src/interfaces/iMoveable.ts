import IDrawable from "./iDrawable";

export default interface IMoveable extends IDrawable {
  move: (deltaX: number, deltaY: number) => void;
}
