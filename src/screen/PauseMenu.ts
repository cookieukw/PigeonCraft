import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import { TitleMenu } from '@/screen/TitleMenu';
import type { Input } from '@/engine/Input';
import type { Screen } from '@/engine/Screen';

export class PauseMenu {
  public selected: number;
  public options: string[];
  public game: any;

  constructor() {
    this.selected = 0;
    this.options = ["RESUME", "SAVE GAME", "LOAD GAME", "QUIT"];
  }

  public tick(input: Input): void {
    if (input.clicked('ArrowUp') || input.clicked('KeyW')) this.selected--;
    if (input.clicked('ArrowDown') || input.clicked('KeyS')) this.selected++;

    const len = this.options.length;
    if (this.selected < 0) this.selected += len;
    if (this.selected >= len) this.selected -= len;

    if (input.clicked('Space') || input.clicked('Enter')) {
      if (this.selected === 0) this.game.setMenu(null);
      if (this.selected === 1) {
          this.game.save();
          this.game.setMenu(null);
      }
      if (this.selected === 2) {
          this.game.load();
          this.game.setMenu(null);
      }
      if (this.selected === 3) {
          this.game.setMenu(new TitleMenu());
      }
    }

    if (input.clicked('Escape')) {
      this.game.setMenu(null);
    }
  }

  public render(screen: Screen): void {
    screen.clear(0);
    Font.draw("PAUSED", screen, (screen.w / 2) - (6 * 4), 40, Color.get(-1, 555, 555, 555));

    for (let i = 0; i < this.options.length; i++) {
      let msg = this.options[i];
      let col = Color.get(-1, 222, 222, 222);
      if (i === this.selected) {
        msg = "> " + msg + " <";
        col = Color.get(-1, 555, 555, 555);
      }
      Font.draw(msg, screen, (screen.w / 2) - (msg.length * 4), 70 + i * 12, col);
    }
  }
}
