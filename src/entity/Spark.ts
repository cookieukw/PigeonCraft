import { Entity } from '@/entity/Entity';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class Spark extends Entity {
  public owner: Entity;
  public xa: number;
  public ya: number;
  public xx: number;
  public yy: number;
  public time: number;
  public lifeTime: number;

  constructor(owner: Entity, xa: number, ya: number) {
    super();
    this.owner = owner;
    this.xa = xa;
    this.ya = ya;
    this.xx = owner.x;
    this.yy = owner.y;
    this.time = 0;
    this.lifeTime = 60 * 10; // 10 seconds max
  }

  public override tick(_input: Input): void {
    this.time++;
    if (this.time > this.lifeTime) this.remove();
    this.xx += this.xa;
    this.yy += this.ya;
    this.x = Math.floor(this.xx);
    this.y = Math.floor(this.yy);

    if (!this.level) return;

    // Hit entities
    const targets = this.level.getEntities(this.x - 4, this.y - 4, this.x + 4, this.y + 4);
    for (const e of targets) {
      if (e !== this.owner) {
        e.hurt(this.owner, 1, 0);
        this.remove();
        return;
      }
    }

    // Hit walls?
    if (!this.level.isFree(this.x, this.y, 2, 2, this)) {
        this.remove();
    }
  }

  public override render(screen: Screen): void {
    const col = Color.get(-1, 555, 555, 555);
    screen.render(this.x - 4, this.y - 4, 1 + 5 * 32, col, 0);
  }
}
