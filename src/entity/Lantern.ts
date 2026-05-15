import { Furniture } from '@/entity/Furniture';
import { Color } from '@/engine/Color';

export class Lantern extends Furniture {
  constructor() {
    super("Lantern");
    this.col = Color.get(-1, 0, 110, 550);
    this.sprite = 3; // Position in furniture spritesheet
    this.xr = 3;
    this.yr = 2;
  }

  getLightRadius() {
    return 8;
  }
}
