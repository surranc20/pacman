export default class MazeNode {
  x: number;
  y: number;
  validPath: any;
  connections: MazeNode[];

  constructor(x: number, y: number, validPath: boolean) {
    this.x = x;
    this.y = y;
    this.validPath = validPath;
    this.connections = [];
  }
}
