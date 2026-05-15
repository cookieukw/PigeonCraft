import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class AboutMenu {
  public parent: any;
  public game: any;

  constructor(parent: any) {
    this.parent = parent;
  }

  public tick(input: Input): void {
    if (input.clicked('Space') || input.clicked('KeyE') || input.clicked('KeyX')) {
      this.game.setMenu(this.parent);
    }
  }

  public render(screen: Screen): void {
    screen.clear(0);
    Font.draw("ABOUT PIGEONCRAFT WEB", screen, (screen.w / 2) - (20 * 4), 20, Color.get(-1, 555, 555, 555));
    
    const lines = [
      "MADE BY MARKUS PERSSON",
      "FOR LUDUM DARE 22",
      "",
      "PORTED TO WEB BY COOKIEUKW",
      "AS A CODING EXERCISE",
      "",
      "THANKS FOR PLAYING!"
    ];

    for (let i = 0; i < lines.length; i++) {
        Font.draw(lines[i], screen, (screen.w / 2) - (lines[i].length * 4), 50 + i * 12, Color.get(-1, 333, 333, 333));
    }

    Font.draw("PRESS SPACE TO RETURN", screen, (screen.w / 2) - (21 * 4), screen.h - 20, Color.get(-1, 111, 111, 111));
  }
}
