import { Mob } from '@/entity/Mob';
import { Color } from '@/engine/Color';
import { Sound } from '@/engine/Sound';
import { Inventory } from '@/item/Inventory';
import { ResourceItem } from '@/item/ResourceItem';
import { Resources } from '@/item/resource/Resource';
import { ToolItem } from '@/item/ToolItem';
import { InventoryMenu } from '@/screen/InventoryMenu';
import { CraftingMenu } from '@/screen/CraftingMenu';
import { Crafting } from '@/item/Crafting';
import { DeathMenu } from '@/screen/DeathMenu';
import { MapMenu } from '@/screen/MapMenu';
import type { Input } from '@/engine/Input';
import type { Screen } from '@/engine/Screen';
import type { Item } from '@/item/Item';

export class Player extends Mob {
  public keys: any;
  public attackTime: number = 0;
  public interactTime: number = 0;
  public inventory: Inventory;
  public score: number = 0;
  public activeItem: Item | null = null;
  public maxStamina: number = 10;
  public stamina: number = 10;
  public staminaRecharge: number = 0;
  public staminaRechargeDelay: number = 0;
  public lightlvl2: number = 12;
  public rising: boolean = false;
  public game: any;

  constructor(keys: any) {
    super();
    this.keys = keys;
    this.xr = 4;
    this.yr = 4;
    this.attackTime = 0;
    this.interactTime = 0;
    this.inventory = new Inventory();
    this.score = 0;
    this.lvl = 1;
    
    // Starting items
    this.inventory.add(new ResourceItem(Resources.wood, 10));
    this.activeItem = null;
    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.maxStamina = 10;
    this.stamina = this.maxStamina;
    this.staminaRecharge = 0;
    this.staminaRechargeDelay = 0;
    this.lightlvl2 = 12;
    this.rising = false;
  }

  public override tick(input: Input): void {
    if (this.health <= 0) {
      this.game.setMenu(new DeathMenu(this));
      return;
    }
    super.tick(input);
    
    if (this.staminaRechargeDelay > 0) this.staminaRechargeDelay--;
    if (this.staminaRechargeDelay === 0 && this.stamina < this.maxStamina) {
      this.staminaRecharge++;
      if (this.isSwimming()) this.staminaRecharge = 0; // No recharge while swimming (original Java behavior)
      if (this.staminaRecharge >= 10) {
        this.stamina++;
        this.staminaRecharge = 0;
      }
    }

    if (input.clicked('KeyE') || input.clicked('KeyX')) {
      this.game.setMenu(new InventoryMenu(this));
    }
    
    if (input.clicked('KeyM')) {
      this.game.setMenu(new MapMenu(this));
    }
    
    if (input.clicked('KeyC')) {
      this.game.setMenu(new CraftingMenu(Crafting.inventory, this));
    }

    // Auto-equip first tool for now
    if (!this.activeItem) {
        this.activeItem = this.inventory.items.find(i => i instanceof ToolItem) || null;
    }

    if ((input.clicked('Space') || input.clicked('KeyV')) && this.attackTime === 0) {
      this.attack();
    }
    if (this.attackTime > 0) this.attackTime--;

    if (input.clicked('KeyF') && this.interactTime === 0) {
      this.interact();
    }
    if (this.interactTime > 0) this.interactTime--;

    if (this.activeItem && (this.activeItem as any).isDepleted && (this.activeItem as any).isDepleted()) {
      this.activeItem = null;
    }

    let xa = 0;
    let ya = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) ya--;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) ya++;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) xa--;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) xa++;
    
    if (this.isSwimming() && this.tickTime % 60 === 0) {
        const tile = this.level?.getTile(this.x >> 4, this.y >> 4);
        if (tile && tile.id === 13) { // Lava
            this.hurt(this, 4, this.dir ^ 1);
        } else if (this.stamina > 0) {
            this.stamina--;
        } else {
            this.hurt(this, 1, this.dir ^ 1);
        }
    }
    this.move(xa, ya);
  }

  public payStamina(cost: number): boolean {
    if (cost > this.stamina) return false;
    this.stamina -= cost;
    this.staminaRechargeDelay = 40;
    return true;
  }

  public attack(): void {
    if (!this.payStamina(1)) return;
    Sound.play('hit');
    this.attackTime = 10;
    let x0 = this.x - 8;
    let y0 = this.y - 8;
    let x1 = this.x + 8;
    let y1 = this.y + 8;
    if (this.dir === 0) y1 += 12;
    if (this.dir === 1) y0 -= 12;
    if (this.dir === 2) x0 -= 12;
    if (this.dir === 3) x1 += 12;

    let dmg = 1 + Math.floor(Math.random() * 2);
    if (this.activeItem) dmg += this.activeItem.getAttackDamageBonus(this);

    if (this.level) {
        const targets = this.level.getEntities(x0, y0, x1, y1);
        for (const e of targets) {
          if (e !== this && (e as any).hurt) {
            (e as any).hurt(this, dmg, this.dir);
          }
        }

        // Hurt tiles
        let xt = this.x >> 4;
        let yt = this.y >> 4;
        if (this.dir === 0) yt = (this.y + 10) >> 4;
        if (this.dir === 1) yt = (this.y - 10) >> 4;
        if (this.dir === 2) xt = (this.x - 10) >> 4;
        if (this.dir === 3) xt = (this.x + 10) >> 4;
        if (xt >= 0 && yt >= 0 && xt < this.level.w && yt < this.level.h) {
          if (this.activeItem && this.activeItem.interactOn) {
            let done = this.activeItem.interactOn(this.level.getTile(xt, yt), this.level, xt, yt, this, this.dir);
            if (done) return;
          }
          this.level.hurtTile(xt, yt, dmg, this.dir);
        }
    }
  }

  public interact(): void {
    this.interactTime = 15;
    let x0 = this.x - 12;
    let y0 = this.y - 12;
    let x1 = this.x + 12;
    let y1 = this.y + 12;
    if (this.dir === 0) { y0 += 12; y1 += 12; }
    if (this.dir === 1) { y0 -= 12; y1 -= 12; }
    if (this.dir === 2) { x0 -= 12; x1 -= 12; }
    if (this.dir === 3) { x0 += 12; x1 += 12; }

    if (this.level) {
        const targets = this.level.getEntities(x0, y0, x1, y1);
        for (const e of targets) {
          if (e !== this && e.use) {
            if (e.use(this, this.dir)) return;
          }
        }
    }
  }

  public override render(screen: Screen): void {
    let xt = 0;
    let yt = 14;
    let flip1 = (this.walkDist >> 3) & 1;
    let flip2 = (this.walkDist >> 3) & 1;

    if (this.dir === 1) xt += 2;
    if (this.dir > 1) {
      flip1 = 0;
      flip2 = (this.walkDist >> 4) & 1;
      if (this.dir === 2) flip1 = 1;
      xt += ((this.walkDist >> 3) & 1) * 2 + 4;
    }

    let xo = Math.floor(this.x - 8);
    let yo = Math.floor(this.y - 11);

    // --- Swimming: match original Java exactly ---
    // yo is shifted FIRST, then ripples drawn at yo+3, then body at the new yo
    if (this.isSwimming() && this.level) {
        yo += 4;
        const tileId = this.level.getTile(this.x >> 4, this.y >> 4).id;
        let waterColor, altColor;
        if (tileId === 13) { // lava
            waterColor = Color.get(-1, -1, 511, 533);
            altColor   = Color.get(-1, 533, 533, 511);
        } else {             // water
            waterColor = Color.get(-1, -1, 115, 335);
            altColor   = Color.get(-1, 335, 5, 115);
        }
        const rippleCol = (Math.floor(this.tickTime / 8) % 2 === 0) ? altColor : waterColor;
        screen.render(xo + 0, yo + 3, 421, rippleCol, 0);
        screen.render(xo + 8, yo + 3, 421, rippleCol, 1);
    }

    let col = (this.hurtTime > 0) ? Color.get(-1, 555, 555, 555) : Color.get(-1, 100, 220, 532);

    // attack sprites (dir 1 = up)
    if (this.attackTime > 0 && this.dir === 1) {
        screen.render(xo + 0, yo - 4, 422, Color.get(-1, 555, 555, 555), 0);
        screen.render(xo + 8, yo - 4, 422, Color.get(-1, 555, 555, 555), 1);
    }
    if (this.attackTime > 0 && this.dir === 0) {
        screen.render(xo + 0, yo + 8 + 4, 422, Color.get(-1, 555, 555, 555), 2);
        screen.render(xo + 8, yo + 8 + 4, 422, Color.get(-1, 555, 555, 555), 3);
    }
    if (this.attackTime > 0 && this.dir === 2) {
        screen.render(xo - 4, yo,     423, Color.get(-1, 555, 555, 555), 1);
        screen.render(xo - 4, yo + 8, 423, Color.get(-1, 555, 555, 555), 3);
    }
    if (this.attackTime > 0 && this.dir === 3) {
        screen.render(xo + 12, yo,     423, Color.get(-1, 555, 555, 555), 0);
        screen.render(xo + 12, yo + 8, 423, Color.get(-1, 555, 555, 555), 2);
    }

    // body (top half always, bottom half only when not swimming)
    screen.render(xo + flip1 * 8,     yo + 0, xt + yt * 32,           col, flip1);
    screen.render(xo + 8 - flip1 * 8, yo + 0, xt + 1 + yt * 32,       col, flip1);
    if (!this.isSwimming()) {
        screen.render(xo + flip2 * 8,     yo + 8, xt + (yt + 1) * 32,     col, flip2);
        screen.render(xo + 8 - flip2 * 8, yo + 8, xt + 1 + (yt + 1) * 32, col, flip2);
    }
  }

  public override die(): void {
    super.die();
    this.game.setMenu(new DeathMenu(this));
  }

  public override canSwim(): boolean { return true; }
}
