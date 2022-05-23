export default class GameTicker {
    stop: boolean;
    frameCount: number;
    fps: number;
    fpsInterval: number;
    then: number;
    startTime: number;
    renderCallback: Function;
    constructor(fps: number, renderCallback: Function);
    startTicking(): void;
    tick: () => void;
}
