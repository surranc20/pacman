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
  connectionsReleasingFromJail: MazeNode[];

  constructor(x: number, y: number, validPath: boolean) {
    this.x = x;
    this.y = y;
    this.validPath = validPath;
    this.connections = [];
    this.connectionsReleasingFromJail = [];
    this.gameObject = null;
    this.warp = false;
    this.pellet = null;
  }

  setupCardinalDirectionHelpers() {
    this.east = this.connections.filter((el) => el.x > this.x)[0];
    this.south = this.connections.filter((el) => el.y > this.y)[0];
    this.north = this.connections.filter((el) => this.y > el.y)[0];
    this.west = this.connections.filter((el) => this.x > el.x)[0];
    this.connectionsReleasingFromJail = Array.from(this.connections);
  }

  centerInNode(centerX: number, centerY: number) {
    const [minX, minY] = [this.x * 8, this.y * 8 + 24];
    const [maxX, maxY] = [minX + 7, minY + 7];

    if (!(minX <= centerX && centerX <= maxX)) {
      console.log("x", minX, centerX, maxX);
      return false;
    }
    if (!(minY <= centerY && centerY <= maxY)) {
      console.log("y", minY, centerY, maxY);
      return false;
    }
    return true;
  }

  get center() {
    return [this.x * 8 + 3, this.y * 8 + 28];
  }
}
