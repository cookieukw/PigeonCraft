import { Item } from '@/item/Item';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Tile } from '@/level/tile/Tile';
import type { Level } from '@/level/Level';
import type { Player } from '@/entity/Player';
import type { Entity } from '@/entity/Entity';

export interface IToolType {
  name: string;
  sprite: number;
}

export const ToolType: Record<string, IToolType> = {
  sword: { name: "Sword", sprite: 160 },
  axe: { name: "Axe", sprite: 161 },
  pickaxe: { name: "Pickaxe", sprite: 162 },
  shovel: { name: "Shovel", sprite: 163 },
  hoe: { name: "Hoe", sprite: 164 },
};

export class ToolItem extends Item {
  public type: IToolType;
  public level: number;

  constructor(type: IToolType, level: number) {
    super();
    this.type = type;
    this.level = level;
    this.name = this.getLevelName(level) + " " + type.name;
  }

  public getLevelName(level: number): string {
    if (level === 0) return "Wood";
    if (level === 1) return "Stone";
    if (level === 2) return "Iron";
    if (level === 3) return "Gold";
    if (level === 4) return "Gem";
    return "";
  }

  public getLevelColor(level: number): number {
    if (level === 0) return Color.get(-1, 100, 322, 430);
    if (level === 1) return Color.get(-1, 111, 333, 555);
    if (level === 2) return Color.get(-1, 100, 322, 544);
    if (level === 3) return Color.get(-1, 110, 440, 553);
    if (level === 4) return Color.get(-1, 101, 404, 545);
    return 0;
  }

  public override renderIcon(screen: Screen, x: number, y: number, overrideCol: number | null = null): void {
    screen.render(x, y, this.type.sprite + this.level, overrideCol || this.getLevelColor(this.level), 0);
  }

  public override canAttack(): boolean {
    return true;
  }

  public override getAttackDamageBonus(_e: Entity): number {
    if (this.type === ToolType.sword) return (this.level + 1) * 2 + Math.floor(Math.random() * 2);
    return this.level + 1;
  }

  public override interactOn(tile: Tile, level: Level, xt: number, yt: number, player: Player, attackDir: number): boolean {
    if (tile.interact) {
      return tile.interact(level, xt, yt, player, this, attackDir);
    }
    return false;
  }
}
