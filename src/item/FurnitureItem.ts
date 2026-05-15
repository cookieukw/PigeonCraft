import { Item } from '@/item/Item';
import { Color } from '@/engine/Color';
import { Font } from '@/engine/Font';
import type { Screen } from '@/engine/Screen';
import type { Tile } from '@/level/tile/Tile';
import type { Level } from '@/level/Level';
import type { Player } from '@/entity/Player';
import type { Furniture } from '@/entity/Furniture';

export class FurnitureItem extends Item {
  public furniture: Furniture;
  public placed: boolean;

  constructor(furniture: Furniture) {
    super();
    this.furniture = furniture;
    this.placed = false;
  }

  public getColor(): number {
    return (this.furniture as any).col;
  }

  public getSprite(): number {
    return ((this.furniture as any).sprite * 2) + 256; 
  }

  public override getName(): string {
    return this.furniture.constructor.name;
  }

  public override renderIcon(screen: Screen, x: number, y: number, overrideCol: number | null = null): void {
    screen.render(x, y, this.getSprite(), overrideCol || this.getColor(), 0);
  }

  public override renderInventory(screen: Screen, x: number, y: number): void {
    screen.render(x, y, this.getSprite(), this.getColor(), 0);
    Font.draw(this.getName(), screen, x + 8, y, Color.get(-1, 555, 555, 555));
  }

  public override canAttack(): boolean {
    return false;
  }

  public override interactOn(tile: Tile, level: Level, xt: number, yt: number, _player: Player, _attackDir: number): boolean {
    if (!tile.mayPass(level, xt, yt, this.furniture)) {
      return false;
    }
    this.furniture.x = (xt * 16) + 8;
    this.furniture.y = (yt * 16) + 8;
    level.add(this.furniture);
    this.placed = true;
    return true;
  }

  public override isDepleted(): boolean {
    return this.placed;
  }
}
