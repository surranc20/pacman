import { Container } from "pixi.js";
import { LabelColors } from "../enums/label_colors";
export default class Label {
    container: Container;
    labelText: string;
    constructor(labelText: string, color?: LabelColors);
    private _createLabel;
}
