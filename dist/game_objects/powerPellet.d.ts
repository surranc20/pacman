import Drawable from "../abstract/drawable";
import IPellet from "../interfaces/iPellet";
export default class PowerPellet extends Drawable implements IPellet {
    powerPellet: boolean;
    constructor(x: number, y: number);
}
