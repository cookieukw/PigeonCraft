import { Mob } from '@/entity/Mob';
import { Color } from '@/engine/Color';
import { Spark } from '@/entity/Spark';
import { WonMenu } from '@/screen/WonMenu';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class AirWizard extends Mob {
  public attackDelay: number;
  public attackTime: number;

  constructor() {
    super();
    this.maxHealth = 200;
    this.health = this.maxHealth;
    this.xa = 0;
    this.ya = 0;
    this.randomWalkTime = 0;
    this.attackDelay = 0;
    this.attackTime = 0;
    this.lvl = 100;
  }

  public override tick(input: Input): void {
    super.tick(input);

    if (this.attackDelay > 0) this.attackDelay--;
    if (this.attackTime > 0) this.attackTime--;

    if (this.level && (this.level as any).player && this.attackDelay === 0) {
      const player = (this.level as any).player;
      let xd = player.x - this.x;
      let yd = player.y - this.y;
      if (xd * xd + yd * yd < 128 * 128) {
        this.attackDelay = 60;
        this.attackTime = 20;
        // Shoot 8 sparks
        for (let i = 0; i < 8; i++) {
          let ang = i * Math.PI * 2 / 8;
          this.level.add(new Spark(this, Math.cos(ang) * 2, Math.sin(ang) * 2));
        }
      }
    }

    if (this.randomWalkTime === 0 || Math.random() < 0.02) {
      this.randomWalkTime = 60;
      this.xa = (Math.random() - 0.5) * 2;
      this.ya = (Math.random() - 0.5) * 2;
    }

    this.move(this.xa, this.ya);
    if (this.randomWalkTime > 0) this.randomWalkTime--;
  }

  public override render(screen: Screen): void {
    let col = Color.get(-1, 100, 500, 555);

    if (this.hurtTime > 0) {
      col = Color.get(-1, 555, 555, 555);
    }

    let xo = this.x - 8;
    let yo = this.y - 11;

    const tileBase = 448 + 4 * 2; // Air Wizard in icons.png (placeholder index)
    screen.render(xo, yo, tileBase, col, 0);
    screen.render(xo + 8, yo, tileBase + 1, col, 0);
    screen.render(xo, yo + 8, tileBase + 32, col, 0);
    screen.render(xo + 8, yo + 8, tileBase + 33, col, 0);
  }

  public override die(): void {
    super.die();
    if (this.level && (this.level as any).player) {
        const player = (this.level as any).player;
        player.game.setMenu(new WonMenu(player));
    }
  }
}
