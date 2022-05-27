import { Container, Loader } from "pixi.js";
import GlobalGameStats from "../models/globalGameStats";

export default interface iScene {
  stage: Container;
  update: (elapsedTime: number) => void;
  addAssetsToLoader: (loader: Loader) => void;
  onDoneLoading: (resources: any) => void;
  done: boolean;
  endScene: () => iScene;
  globalData: GlobalGameStats | null;
  globalDataLoaded: (globalData: GlobalGameStats) => void;
}
