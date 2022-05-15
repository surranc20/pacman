import { Cardinal } from "../enums/cardinal";
import { Color } from "../enums/color";
import { ReleasingFromJailState } from "../enums/releasingFromJail";
import Ghost from "../game_objects/ghost";

export default class GhostJail {
  ghosts: Set<Ghost>;
  priorityList = [Color.RED, Color.PINK, Color.BLUE, Color.ORANGE];
  ghostDotCounter: Map<Color, number>;

  globalCounter = 0;
  globalCounterActivated = false;
  globalDotThresholds: Map<number, Color>;

  constructor(ghosts: Array<Ghost>) {
    this.ghosts = new Set();
    this.ghostDotCounter = new Map<Color, number>([
      [Color.PINK, 0],
      [Color.RED, 0],
      [Color.BLUE, 30],
      [Color.ORANGE, 60],
    ]);
    this.globalDotThresholds = new Map<number, Color>([
      [7, Color.PINK],
      [13, Color.BLUE],
      [32, Color.ORANGE],
    ]);
    ghosts.map((ghost) => this.addGhost(ghost));
  }

  addGhost(ghost: Ghost) {
    // Add ghost to Maze and change its pos
    this.ghosts.add(ghost);
    ghost.jailed = true;
    const [xTile, yTile] = [10 + this.ghosts.size * 2, 14];
    ghost.mazeNode = ghost.mazeModel.nodes.get([xTile, yTile].toString())!;
    ghost.x = xTile * 8;
    ghost.y = yTile * 8 + 24 + 4;

    // Make ghost face the correct direction
    if (this.ghosts.size % 2) {
      ghost.facing = Cardinal.SOUTH;
    } else {
      ghost.facing = Cardinal.NORTH;
    }
    ghost.queuedMove = ghost.facing;

    ghost.setCorrectSpriteSheet();
    ghost.getTexture();

    ghost.speedModifier = 0.5;
  }

  releaseGhost(ghost: Ghost) {
    this.ghosts.delete(ghost);
    ghost.jailed = false;
    ghost.releasingFromJail = ReleasingFromJailState.Y_LEVELING;
  }

  update(_elapsedTime: number) {}

  dotEaten() {
    // Flow when global counter is activated (after pacman dies)
    if (this.globalCounterActivated) {
      this.globalCounter += 1;
      if (this.globalDotThresholds.has(this.globalCounter)) {
        const ghost = this.mapColorToGhost(
          this.globalDotThresholds.get(this.globalCounter)!
        )!;
        this.releaseGhost(ghost);
      }
      return;
    }

    // Normal flow
    if (this.ghosts.size === 0) return;
    for (const color of this.priorityList) {
      const ghost = this.mapColorToGhost(color);
      if (ghost) {
        const newVal = this.ghostDotCounter.get(color)! - 1;
        this.ghostDotCounter.set(color, newVal);

        if (newVal <= 0) {
          this.releaseGhost(ghost);
        }
      }
    }
  }

  mapColorToGhost(color: Color) {
    for (const ghost of this.ghosts) {
      if (ghost.color === color) {
        return ghost;
      }
    }
  }
}
