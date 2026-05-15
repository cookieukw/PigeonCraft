import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import { Tile } from '@/level/tile/Tile';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';
import type { Player } from '@/entity/Player';

export class MapMenu {
  public player: Player;
  public game: any;

  constructor(player: Player) {
    this.player = player;
  }

  public tick(input: Input): void {
    if (input.clicked('KeyM') || input.clicked('KeyE') || input.clicked('KeyX') || input.clicked('Escape')) {
      this.game.setMenu(null);
    }
  }

  public render(screen: Screen): void {
    screen.clear(0);
    const level = this.player.level;
    if (!level) return;
    
    const x0 = Math.floor((screen.w - level.w) / 2);
    const y0 = Math.floor((screen.h - level.h) / 2);

    // Draw background for map
    for (let y = 0; y < level.h; y++) {
      for (let x = 0; x < level.w; x++) {
        const id = level.map[x + y * level.w];
        const tile = Tile.tiles[id];
        let col = 0;
        if (tile && tile.getMapColor) {
            col = tile.getMapColor(level, x, y);
        }
        
        if (col !== 0) {
            const colorIndex = (col >> 16) & 0xff;
            const screenIdx = (x + x0) + (y + y0) * screen.w;
            if (screenIdx >= 0 && screenIdx < screen.pixels.length) {
                screen.pixels[screenIdx] = screen.colors[colorIndex];
            }
        }
      }
    }

    // Draw player position
    const px = Math.floor(this.player.x / 16) + x0;
    const py = Math.floor(this.player.y / 16) + y0;
    const pIdx = px + py * screen.w;
    if (pIdx >= 0 && pIdx < screen.pixels.length) {
        screen.pixels[pIdx] = screen.colors[Color.get(-1, 555, 555, 555) & 0xff];
    }

    Font.draw("WORLD MAP", screen, (screen.w / 2) - (9 * 4), 10, Color.get(-1, 555, 555, 555));
  }
}
