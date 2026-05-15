import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import { TitleMenu } from '@/screen/TitleMenu';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';
import type { Player } from '@/entity/Player';

export class WonMenu {
  public player: Player;
  public inputDelay: number;
  public game: any;

  constructor(player: Player) {
    this.player = player;
    this.inputDelay = 60;
  }

  public tick(input: Input): void {
    if (this.inputDelay > 0) {
        this.inputDelay--;
        return;
    }
    if (input.clicked('Space') || input.clicked('Enter')) {
      this.game.setMenu(new TitleMenu());
    }
  }

  public render(screen: Screen): void {
    screen.clear(0);
    Font.draw("YOU WON!", screen, (screen.w / 2) - (8 * 4), 50, Color.get(-1, 555, 555, 555));
    
    const scoreMsg = `SCORE: ${this.player.score}`;
    Font.draw(scoreMsg, screen, (screen.w / 2) - (scoreMsg.length * 4), 80, Color.get(-1, 333, 333, 333));

    if (this.inputDelay === 0) {
        Font.draw("PRESS SPACE TO RETURN", screen, (screen.w / 2) - (21 * 4), screen.h - 30, Color.get(-1, 111, 111, 111));
    }
  }
}
