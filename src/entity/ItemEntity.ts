import { Entity } from '@/entity/Entity';
import { Color } from '@/engine/Color';
import { Sound } from '@/engine/Sound';
import type { Screen } from '@/engine/Screen';
import type { Item } from '@/item/Item';
import type { Player } from '@/entity/Player';

export class ItemEntity extends Entity {
  public item: Item;
  public xx: number;
  public yy: number;
  public zz: number;
  public xa: number;
  public ya: number;
  public za: number;
  public time: number;
  public lifeTime: number;

  constructor(item: Item, x: number, y: number) {
    super();
    this.item = item;
    this.x = x;
    this.y = y;
    this.xx = x;
    this.yy = y;
    this.zz = 2.0;
    this.xa = (Math.random() - 0.5) * 0.6;
    this.ya = (Math.random() - 0.5) * 0.4;
    this.za = Math.random() * 0.7 + 1.0;
    this.xr = 3;
    this.yr = 3;
    this.time = 0;
    this.lifeTime = 600; // 10 seconds
  }

  public override tick(): void {
    this.time++;
    if (this.time >= this.lifeTime) {
      this.remove();
      return;
    }
    
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
    
    let nx = Math.floor(this.xx);
    let ny = Math.floor(this.yy);
    
    this.move(nx - this.x, ny - this.y);
    
    // Pick up on touch with player
    if (this.level && (this.level as any).player && this.time > 30) {
        const player = (this.level as any).player;
        let xd = player.x - this.x;
        let yd = player.y - this.y;
        if (Math.abs(xd) < 12 && Math.abs(yd) < 12) {
            this.take(player);
        }
    }
  }

  public take(player: Player): void {
    Sound.play('pickup');
    player.inventory.add(this.item);
    this.remove();
  }

  public override render(screen: Screen): void {
    if (this.time < this.lifeTime - 120 || (Math.floor(this.time / 6) % 2 !== 0)) {
        // Shadow
        this.item.renderIcon(screen, this.x - 4, this.y - 4, Color.get(-1, 0, 0, 0));
        // Item
        this.item.renderIcon(screen, this.x - 4, this.y - 4 - Math.floor(this.zz));
    }
  }
}
