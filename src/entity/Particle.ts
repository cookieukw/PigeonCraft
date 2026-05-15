import { Entity } from '@/entity/Entity';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class Particle extends Entity {
  public col: number;
  public time: number;
  public lifeTime: number;
  public xa: number;
  public ya: number;
  public xx: number;
  public yy: number;

  constructor(x: number, y: number, col: number) {
    super();
    this.x = x;
    this.y = y;
    this.col = col;
    this.time = 0;
    this.lifeTime = 30;
    this.xa = (Math.random() - 0.5) * 2;
    this.ya = (Math.random() - 0.5) * 2;
    this.xx = x;
    this.yy = y;
  }

  public override tick(_input: Input): void {
    this.time++;
    if (this.time > this.lifeTime) this.remove();
    this.xx += this.xa;
    this.yy += this.ya;
    this.x = Math.floor(this.xx);
    this.y = Math.floor(this.yy);
  }

  public override render(screen: Screen): void {
    screen.render(this.x, this.y, 0, this.col, 0);
  }
}
