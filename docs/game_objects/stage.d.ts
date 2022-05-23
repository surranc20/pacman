import Animatable from "../abstract/animatable";
export default class Stage extends Animatable {
    flashing: boolean;
    doneFlashingCallback: any;
    flashes: number;
    fps: number;
    update(elapsedTime: number): void;
    flashStage(callback: () => void): void;
    loadWhiteStage(): void;
}
