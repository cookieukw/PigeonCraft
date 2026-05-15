import { Entity } from '@/entity/Entity';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class Torch extends Entity {
  public hit: number;
  public time: number;
  public sprite: number;
  public sprites: number[];
  public col: number;

  constructor() {
    super();
    this.xr = 3;
    this.yr = 3;
    this.hit = 0;
    this.time = 0;
    this.sprite = 0;
    this.sprites = [142, 143];
    this.col = Color.get(-1, 210, 420, 550);
  }

  public override tick(_input: Input): void {
    this.time++;
    if (this.time % 15 === 0 || Math.random() < 0.03) {
      this.sprite ^= 1;
    }
  }

  public override render(screen: Screen): void {
    screen.render(Math.floor(this.x) - 4, Math.floor(this.y) - 4, this.sprites[this.sprite], this.col, 0);
  }

  public getLightRadius(): number { return 6; }

  public override hurt(_source: Entity | null, _damage: number, _dir: number): void {
    this.hit++;
    if (this.hit >= 2) this.remove();
  }
}
