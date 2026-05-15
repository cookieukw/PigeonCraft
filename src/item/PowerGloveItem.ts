import { Item } from '@/item/Item';
import { Color } from '@/engine/Color';
import { Font } from '@/engine/Font';
import { Furniture } from '@/entity/Furniture';
import type { Screen } from '@/engine/Screen';
import type { Entity } from '@/entity/Entity';
import type { Player } from '@/entity/Player';

export class PowerGloveItem extends Item {
  public override getColor(): number { return Color.get(-1, 100, 320, 430); }
  public getSprite(): number { return 135; }
  public override getName(): string { return 'Lift glove'; }

  public override renderIcon(screen: Screen, x: number, y: number): void {
    screen.render(x, y, this.getSprite(), this.getColor(), 0);
  }

  public override renderInventory(screen: Screen, x: number, y: number): void {
    screen.render(x, y, this.getSprite(), this.getColor(), 0);
    Font.draw(this.getName(), screen, x + 8, y, Color.get(-1, 555, 555, 555));
  }

  public override interact(player: Player, entity: Entity, _attackDir: number): boolean {
    if (!(entity instanceof Furniture)) return false;
    (entity as any).take(player);
    return true;
  }

  public override isDepleted(): boolean { return false; }
}
