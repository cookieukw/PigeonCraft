import type { Screen } from '@/engine/Screen';
import type { Tile } from '@/level/tile/Tile';
import type { Level } from '@/level/Level';
import type { Player } from '@/entity/Player';
import type { Entity } from '@/entity/Entity';

export class Item {
  public name: string;

  constructor() {
    this.name = "";
  }

  public getColor(): number { return 0; }
  public getSprite(): number { return 0; }
  public renderIcon(_screen: Screen, _x: number, _y: number, _overrideCol?: number | null): void {}
  public renderInventory(_screen: Screen, _x: number, _y: number): void {}
  
  public interactOn(_tile: Tile, _level: Level, _xt: number, _yt: number, _player: Player, _attackDir: number): boolean {
    return false;
  }
  
  public interact(_player: Player, _entity: Entity, _attackDir: number): boolean {
    return false;
  }
  
  public isDepleted(): boolean {
    return false;
  }
  
  public canAttack(): boolean {
    return false;
  }
  
  public getAttackDamageBonus(_e: Entity): number {
    return 0;
  }

  public getName(): string {
    return this.name;
  }
}
