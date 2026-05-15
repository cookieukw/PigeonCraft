import { Entity } from '@/entity/Entity';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class SmashParticle extends Entity {
  public time: number;
  public col: number;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    this.time = 0;
    this.col = Color.get(-1, 555, 555, 555);
  }

  public override tick(_input: Input): void {
    this.time++;
    if (this.time > 10) this.remove();
  }

  public override render(screen: Screen): void {
    screen.render(this.x - 4, this.y - 4, 5 + 12 * 32, this.col, 0);
  }
}
