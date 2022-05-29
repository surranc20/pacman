export default class GlobalGameStats {
  totalScore: number;
  highScore: number;
  totalDotsEaten: number;
  constructor(highScore: number, totalScore: number, totalDotsEaten: number) {
    this.highScore = highScore;
    this.totalScore = totalScore;
    this.totalDotsEaten = totalDotsEaten;
  }
}
