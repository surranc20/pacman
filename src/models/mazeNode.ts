import { Constants } from "../enums/constants";
import Pacman from "../game_objects/pacman";
import Pellet from "../game_objects/pellet";

export default class MazeNode {
  x: number;
  y: number;
  validPath: any;
  connections: MazeNode[];
  gameObject: Pacman | any;
  pellet: Pellet | null;
  east!: MazeNode;
  south!: MazeNode;
  north!: MazeNode;
  west!: MazeNode;
  warp: boolean;

  constructor(x: number, y: number, validPath: boolean) {
    this.x = x;
    this.y = y;
    this.validPath = validPath;
    this.connections = [];
    this.gameObject = null;
    this.warp = false;
    this.pellet = null;
  }

  setupCardinalDirectionHelpers() {
    this.east = this.connections.filter((el) => el.x > this.x)[0];
    this.south = this.connections.filter((el) => el.y > this.y)[0];
    this.north = this.connections.filter((el) => this.y > el.y)[0];
    this.west = this.connections.filter((el) => this.x > el.x)[0];
  }

  centerInNode(centerX: number, centerY: number) {
    const minX = this.x * Constants.TILE_SIZE;
    const minY =
      this.y * Constants.TILE_SIZE +
      Constants.TILE_SIZE * Constants.BLANK_Y_TILES;
    const [maxX, maxY] = [minX + 7, minY + 7];

    if (!(minX <= centerX && centerX <= maxX)) {
      return false;
    }
    if (!(minY <= centerY && centerY <= maxY)) {
      return false;
    }
    return true;
  }

  update(elapsedTime: number) {
    if (this.pellet?.powerPellet) {
      this.pellet.update(elapsedTime);
    }
  }

  // Center of tile is 3 pixels in and 4 pixels down
  get center() {
    const x = this.x * Constants.TILE_SIZE + 3;
    const y =
      this.y * Constants.TILE_SIZE +
      Constants.TILE_SIZE * Constants.BLANK_Y_TILES +
      4;
    return [x, y];
  }
}
