import type { Level } from '@/level/Level';
import type { Input } from '@/engine/Input';
import type { Screen } from '@/engine/Screen';
import type { Player } from '@/entity/Player';

export class Entity {
  public x: number = 0;
  public y: number = 0;
  public xr: number = 4;
  public yr: number = 4;
  public level: Level | null = null;
  public removed: boolean = false;

  constructor() {
  }

  public init(level: Level): void {
    this.level = level;
  }

  public tick(_input: Input): void {}

  public use(_player: Player, _attackDir: number): boolean {
    return false;
  }

  public render(_screen: Screen): void {}

  public move(xa: number, ya: number): boolean {
    if (xa !== 0 || ya !== 0) {
      let stopped = true;
      if (xa !== 0 && this.moveInternal(xa, 0)) stopped = false;
      if (ya !== 0 && this.moveInternal(0, ya)) stopped = false;
      return !stopped;
    }
    return true;
  }

  protected moveInternal(xa: number, ya: number): boolean {
    if (!this.level) return false;
    if (this.level.isFree(this.x + xa, this.y + ya, this.xr, this.yr, this)) {
      this.x += xa;
      this.y += ya;
      return true;
    }

    return false;
  }

  public intersects(x0: number, y0: number, x1: number, y1: number): boolean {
    return !(this.x + this.xr < x0 || this.y + this.yr < y0 || this.x - this.xr > x1 || this.y - this.yr > y1);
  }

  public remove(): void {
    this.removed = true;
  }

  public hurt(_source: Entity | null, _damage: number, _dir: number): void {}

  public touchedBy(_entity: Entity): void {}

  // Override in Player to return true — lets player pass HoleTile and WoodDoorTile
  public canSwim(): boolean { return false; }
}
