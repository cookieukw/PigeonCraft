import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';
import type { Player } from '@/entity/Player';
import type { Item } from '@/item/Item';

export class Tile {
  public static tiles: Tile[] = new Array(256);
  public id: number;
  public connectsToGrass: boolean = false;
  public connectsToSand: boolean = false;
  public connectsToWater: boolean = false;
  public connectsToLava: boolean = false;

  constructor(id: number) {
    this.id = id;
    Tile.tiles[id] = this;
  }

  public render(_screen: Screen, _level: Level, _x: number, _y: number): void {}
  public mayPass(_level: Level, _x: number, _y: number, _entity: Entity | { canSwim?(): boolean } | null): boolean { return true; }
  public hurt(_level: Level, _x: number, _y: number, _source: Entity | null, _dmg: number, _dir: number): void {}
  public interact(_level: Level, _x: number, _y: number, _player: Player, _item: Item | null, _dir: number): boolean { return false; }
  public getMapColor(_level: Level, _x: number, _y: number): number { return 0; }
  public tick?(_level: Level, _x: number, _y: number): void;
  public getLightRadius?(_level: Level, _x: number, _y: number): number;
}
