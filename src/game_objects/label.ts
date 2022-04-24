import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";

export default class Label {
  container: Container;
  labelText: string;

  constructor(labelText: string) {
    this.container = new Container();
    this.labelText = labelText;
    this._createLabel();
  }

  private _createLabel() {
    let xPos = 0;
    for (const char of this.labelText.toLowerCase()) {
      if (/[a-z]/.test(char)) {
        const charTexture =
          Loader.shared.resources.spritesheet.spritesheet?.textures[
            `White Letters/letters_white_${char}.png`
          ]!;
        this.container.addChild(new CharDrawable(xPos, 0, charTexture));
      } else if (/^-?\d+$/.test(char)) {
        const charTexture =
          Loader.shared.resources.spritesheet.spritesheet?.textures[
            `White Numbers/white_num${char}.png`
          ]!;
        this.container.addChild(new CharDrawable(xPos, 0, charTexture));
      }
      xPos += 8;
    }
  }
}

class CharDrawable extends Drawable {}
