import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import { Sound } from '@/engine/Sound';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';
import type { Player } from '@/entity/Player';

export class DeathMenu {
  public player: Player;
  public time: number;
  public game: any;

  constructor(player: Player) {
    this.player = player;
    this.time = 0;
    Sound.play('death');
  }

  public tick(input: Input): void {
    this.time++;
    if (this.time > 60) {
      if (input.clicked('Space') || input.clicked('Enter')) {
        // Restart game (reload for now)
        window.location.reload();
      }
    }
  }

  public render(screen: Screen): void {
    screen.clear(0);
    Font.draw("YOU DIED!", screen, (screen.w / 2) - (9 * 4), 60, Color.get(-1, 500, 500, 500));
    
    let scoreMsg = "SCORE: " + this.player.score;
    Font.draw(scoreMsg, screen, (screen.w / 2) - (scoreMsg.length * 4), 80, Color.get(-1, 555, 555, 555));

    if (this.time > 60) {
        Font.draw("PRESS SPACE TO RESTART", screen, (screen.w / 2) - (22 * 4), 140, Color.get(-1, 333, 333, 333));
    }
  }
}
