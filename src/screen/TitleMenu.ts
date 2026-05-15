import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import { Sound } from '@/engine/Sound';
import { Screen } from '@/engine/Screen';
import { Input } from '@/engine/Input';

export class TitleMenu {
  public selected: number;
  public options: string[];
  public game: any;

  constructor() {
    this.selected = 0;
    this.options = ["START GAME", "LOAD GAME", "HOW TO PLAY", "ABOUT"];
  }

  async tick(input: Input) {
    if (input.clicked('KeyW') || input.clicked('ArrowUp')) this.selected--;
    if (input.clicked('KeyS') || input.clicked('ArrowDown')) this.selected++;

    if (this.selected < 0) this.selected += this.options.length;
    if (this.selected >= this.options.length) this.selected -= this.options.length;

    if (input.clicked('Space') || input.clicked('Enter')) {
      if (this.selected === 0) {
        Sound.playMusic();
        this.game.setMenu(null);
      }
      if (this.selected === 1) {
          Sound.playMusic();
          this.game.load();
          this.game.setMenu(null);
      }
      if (this.selected === 2) {
        const { InstructionsMenu } = await import('./InstructionsMenu');
        this.game.setMenu(new InstructionsMenu(this));
      }
      if (this.selected === 3) {
        const { AboutMenu } = await import('./AboutMenu');
        this.game.setMenu(new AboutMenu(this));
      }
    }
  }

  render(screen: Screen) {
    screen.clear(0);
    Font.draw("PIGEONCRAFT WEB", screen, (screen.w / 2) - (13 * 4), 40, Color.get(-1, 555, 555, 555));
    
    for (let i = 0; i < this.options.length; i++) {
        let msg = this.options[i];
        let col = Color.get(-1, 222, 222, 222);
        if (i === this.selected) {
            msg = "> " + msg + " <";
            col = Color.get(-1, 555, 555, 555);
        }
        Font.draw(msg, screen, (screen.w / 2) - (msg.length * 4), 80 + i * 12, col);
    }

    Font.draw("(C) 2026 Cookieukw", screen, (screen.w / 2) - (21 * 3), 160, Color.get(-1, 111, 111, 111));
    
    ///const highscore = localStorage.getItem('pigeoncraft_highscore') || '0';
   // Font.draw("HIGHSCORE: " + highscore, screen, (screen.w / 2) - (("HIGHSCORE: " + highscore).length * 4), 175, Color.get(-1, 550, 550, 550));
  }
}
