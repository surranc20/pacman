import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";
import { Constants } from "../enums/constants";
import { LabelColors } from "../enums/label_colors";

export default class Label {
  container: Container;
  labelText: string;

  constructor(labelText: string, color = LabelColors.WHITE) {
    this.container = new Container();
    this.labelText = labelText;
    this._createLabel(color);
  }

  private _createLabel(color: LabelColors) {
    let xPos = 0;
    for (const char of this.labelText.toLowerCase()) {
      if (/[a-z]/.test(char) || char === "!") {
        let capColorName = color[0].toLocaleUpperCase() + color.substring(1);
        const charTexture =
          Loader.shared.resources.spritesheet.spritesheet?.textures[
            `${capColorName} Letters/letters_${color}_${char}.png`
          ]!;
        this.container.addChild(new CharDrawable(xPos, 0, charTexture));
      } else if (/^-?\d+$/.test(char)) {
        const charTexture =
          Loader.shared.resources.spritesheet.spritesheet?.textures[
            `White Numbers/white_num${char}.png`
          ]!;
        this.container.addChild(new CharDrawable(xPos, 0, charTexture));
      }
      xPos += Constants.TILE_SIZE;
    }
  }
}

class CharDrawable extends Drawable {}
