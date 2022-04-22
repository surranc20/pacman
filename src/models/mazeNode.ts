import Pacman from "../game_objects/pacman";

export default class MazeNode {
  x: number;
  y: number;
  validPath: any;
  connections: MazeNode[];
  gameObject: Pacman | any;

  constructor(x: number, y: number, validPath: boolean) {
    this.x = x;
    this.y = y;
    this.validPath = validPath;
    this.connections = [];
    this.gameObject = null;
  }

  get east() {
    return this.connections.filter((el) => el.x > this.x)[0];
  }

  get south() {
    return this.connections.filter((el) => el.y > this.y)[0];
  }

  get north() {
    return this.connections.filter((el) => this.y > el.y)[0];
  }

  get west() {
    return this.connections.filter((el) => this.x > el.x)[0];
  }

  centerInNode(centerX: number, centerY: number) {
    const [minX, minY] = [(this.x + 1) * 8, (1 + this.y) * 8 + 24];
    const [maxX, maxY] = [minX + 7, minY + 7];

    if (!(minX <= centerX && centerX <= maxX)) {
      return false;
    }
    if (!(minY <= centerY && centerY <= maxY)) {
      return false;
    }
    return true;
  }

  get center() {
    return [(this.x + 1) * 8 + 3, (this.y + 1) * 8 + 28];
  }
}
