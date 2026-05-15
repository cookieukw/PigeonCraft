import { Color } from '@/engine/Color';
import { Screen } from '@/engine/Screen';

export class Font {
  static chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ|@&   0123456789.,!?'\"-+=/\\%()<>:;    ";

  static draw(msg: string, screen: Screen, x: number, y: number, col: number) {
    msg = msg.toUpperCase();
    for (let i = 0; i < msg.length; i++) {
      const ix = this.chars.indexOf(msg.charAt(i));
      if (ix >= 0) {
        screen.render(x + i * 8, y, ix + 30 * 32, col, 0);
      }
    }
  }

  static renderFrame(screen: Screen, title: string, x0: number, y0: number, x1: number, y1: number) {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        let flip = 0;
        let tile = 0;
        let col = Color.get(-1, 1, 5, 445);

        if (x === x0 && y === y0) { tile = 416; flip = 0; }
        else if (x === x1 && y === y0) { tile = 416; flip = 1; }
        else if (x === x0 && y === y1) { tile = 416; flip = 2; }
        else if (x === x1 && y === y1) { tile = 416; flip = 3; }
        else if (y === y0) { tile = 417; flip = 0; }
        else if (y === y1) { tile = 417; flip = 2; }
        else if (x === x0) { tile = 418; flip = 0; }
        else if (x === x1) { tile = 418; flip = 1; }
        else {
            tile = 418; col = Color.get(5, 5, 5, 5);
        }
        
        screen.render(x * 8, y * 8, tile, col, flip);
      }
    }
    this.draw(title, screen, x0 * 8 + 8, y0 * 8, Color.get(5, 5, 5, 550));
  }
}
