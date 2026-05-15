import type { Screen } from '@/engine/Screen';

export class LevelTransitionMenu {
  public dir: number;
  public callback: () => void;
  public time: number;
  public game: any;

  constructor(dir: number, callback: () => void) {
    this.dir = dir;
    this.callback = callback;
    this.time = 0;
  }

  public tick(): void {
    this.time += 2;
    if (this.time === 30) {
      this.callback();
    }
    if (this.time === 60) {
        this.game.setMenu(null);
    }
  }

  public render(screen: Screen): void {
    // Simple black fade transition
    let r = this.time;
    if (r > 30) r = 60 - r;
    
    // Actually, let's just do a simple black fade
    // screen.clear(0); is enough for a basic transition in this engine
    screen.clear(0);
  }
}
