import { Cardinal } from "../enums/cardinal";
import { Color } from "../enums/color";
import { GoingToJailState } from "../enums/goingToJail";
import { ReleasingFromJailState } from "../enums/releasingFromJail";
import Ghost from "../game_objects/ghost";
import { getTargetGoToJail } from "../utils/ghostTargetingAlgorithms";

export default class GhostJail {
  ghosts: Map<Ghost, number>;
  jailSlots: Map<number, Ghost | null>;
  priorityList = [Color.RED, Color.PINK, Color.BLUE, Color.ORANGE];
  ghostDotCounter: Map<Color, number>;

  globalCounter = 0;
  globalCounterActivated = false;
  globalDotThresholds: Map<number, Color>;
  defaultTimer: number;
  timer: number;

  constructor(ghosts: Array<Ghost>) {
    this.ghosts = new Map<Ghost, number>();
    this.jailSlots = new Map<number, Ghost | null>([
      [1, null],
      [2, null],
      [3, null],
    ]);

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

    this.defaultTimer = 5;
    this.timer = 5;
  }

  sendToJail(ghost: Ghost) {
    ghost.speedModifier = 2;
    ghost.setDefaultTexture();
    ghost.agent.targetAI = getTargetGoToJail;
    ghost.goingToJailState = GoingToJailState.TRAVELING_TO_JAIL;
  }

  addGhost(ghost: Ghost) {
    // Add ghost to Maze and change its pos

    ghost.jailed = true;

    let jailSlot = 0;
    for (let x = 1; x < 4; x++) {
      if (!this.jailSlots.get(x)) {
        this.jailSlots.set(x, ghost);
        jailSlot = x;
        this.ghosts.set(ghost, jailSlot);
        break;
      }
    }
    const [xTile, yTile] = [10 + jailSlot * 2, 14];
    ghost.mazeNode = ghost.mazeModel.getNode(xTile, yTile);
    ghost.x = xTile * 8;
    ghost.y = yTile * 8 + 24 + 4;

    // Make ghost face the correct direction
    if (jailSlot % 2) {
      ghost.facing = Cardinal.SOUTH;
    } else {
      ghost.facing = Cardinal.NORTH;
    }
    ghost.queuedMove = ghost.facing;
    ghost.setCorrectSpriteSheet();
    ghost.getTexture();

    // Ghosts slow down in jail
    ghost.speedModifier = 0.5;
  }

  releaseGhost(ghost: Ghost) {
    const slot = this.ghosts.get(ghost)!;
    this.ghosts.delete(ghost);
    this.jailSlots.set(slot, null);
    ghost.jailed = false;
    ghost.releasingFromJailState = ReleasingFromJailState.Y_LEVELING;
  }

  update(elapsedTime: number) {
    this.timer -= elapsedTime;
    if (this.timer < 0) {
      for (const color of this.priorityList) {
        const ghost = this.mapColorToGhost(color);
        if (ghost) {
          this.releaseGhost(ghost);
          this.timer = this.defaultTimer;
          return;
        }
      }
    }
  }

  dotEaten() {
    this.timer = this.defaultTimer;

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
          return;
        }
      }
    }
  }

  mapColorToGhost(color: Color) {
    for (const ghost of this.ghosts.keys()) {
      if (ghost.color === color) {
        return ghost;
      }
    }
  }

  clearJail() {
    this.ghosts = new Map();
  }
}
