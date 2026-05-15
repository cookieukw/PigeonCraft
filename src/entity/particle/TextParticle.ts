import { Entity } from '@/entity/Entity';
import { Color } from '@/engine/Color';
import { Font } from '@/engine/Font';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class TextParticle extends Entity {
  public msg: string;
  public col: number;
  public xx: number;
  public yy: number;
  public zz: number;
  public xa: number;
  public ya: number;
  public za: number;
  public time: number;

  constructor(msg: string, x: number, y: number, col: number) {
    super();
    this.msg = msg;
    this.x = x;
    this.y = y;
    this.col = col;
    this.xx = x;
    this.yy = y;
    this.zz = 2;
    this.xa = (Math.random() - 0.5) * 0.3;
    this.ya = (Math.random() - 0.5) * 0.2;
    this.za = Math.random() * 0.7 + 2;
    this.time = 0;
  }

  public override tick(_input: Input): void {
    this.time++;
    if (this.time > 60) this.remove();
    this.xx += this.xa;
    this.yy += this.ya;
    this.zz += this.za;
    if (this.zz < 0) {
      this.zz = 0;
      this.za *= -0.5;
      this.xa *= 0.6;
      this.ya *= 0.6;
    }
    this.za -= 0.15;
    this.x = Math.floor(this.xx);
    this.y = Math.floor(this.yy);
  }

  public override render(screen: Screen): void {
    Font.draw(this.msg, screen, this.x - this.msg.length * 4 + 1, this.y - Math.floor(this.zz) + 1, Color.get(-1, 0, 0, 0));
    Font.draw(this.msg, screen, this.x - this.msg.length * 4, this.y - Math.floor(this.zz), this.col);
  }
}
