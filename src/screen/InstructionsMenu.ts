import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class InstructionsMenu {
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
    Font.draw("HOW TO PLAY", screen, (screen.w / 2) - (11 * 4), 10, Color.get(-1, 555, 555, 555));
    
    const lines = [
      "WASD/ARROWS: MOVE",
      "SPACE/V: ATTACK / USE ITEM",
      "E/X: OPEN INVENTORY",
      "C: OPEN CRAFTING",
      "F: INTERACT WITH OBJECTS",
      "M: VIEW MAP",
      "",
      "KILL MONSTERS TO SURVIVE",
      "GATHER RESOURCES TO CRAFT",
      "DEFEAT THE AIR WIZARD!"
    ];

    for (let i = 0; i < lines.length; i++) {
        Font.draw(lines[i], screen, (screen.w / 2) - (lines[i].length * 4), 35 + i * 11, Color.get(-1, 333, 333, 333));
    }

    Font.draw("PRESS SPACE TO RETURN", screen, (screen.w / 2) - (21 * 4), screen.h - 15, Color.get(-1, 111, 111, 111));
  }
}
