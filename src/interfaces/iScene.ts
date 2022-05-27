import { Container, Loader } from "pixi.js";

export default interface iScene {
  stage: Container;
  update: (elapsedTime: number) => void;
  addAssetsToLoader: (loader: Loader) => void;
  onDoneLoading: (resources: any) => void;
  done: boolean;
  endScene: () => iScene;
}
