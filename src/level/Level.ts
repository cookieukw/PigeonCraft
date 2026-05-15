import { Tile } from '@/level/tile/Tile';
import { Zombie } from '@/entity/Zombie';
import { Slime } from '@/entity/Slime';
import { Skeleton } from '@/entity/Skeleton';
import { Pigeon } from '@/entity/Pigeon';
import type { Entity } from '@/entity/Entity';
import type { Player } from '@/entity/Player';
import type { Input } from '@/engine/Input';
import type { Screen } from '@/engine/Screen';

export class Level {
  public w: number;
  public h: number;
  public map: Uint8Array;
  public data: Uint8Array;
  public entities: Entity[];
  public player: Player | null = null;
  public tickCount: number = 0;
  public monsterDensity: number = 8;
  public depth: number = 0;
  public onLevelChange?: (dir: number) => void;
  public entitiesInTiles: Entity[][];
  public dirtColor: number = 222;

  constructor(w: number, h: number, levelData: { map: Uint8Array, data: Uint8Array }) {
    this.w = w;
    this.h = h;
    this.map = levelData.map;
    this.data = levelData.data;
    this.entities = [];
    this.player = null;
    this.tickCount = 0;
    this.monsterDensity = 8;
    this.depth = 0;
    
    this.entitiesInTiles = new Array(w * h);
    for (let i = 0; i < w * h; i++) {
      this.entitiesInTiles[i] = [];
    }
  }

  public add(entity: Entity): void {
    if (entity.constructor.name === "Player") {
      this.player = entity as Player;
    }
    entity.removed = false;
    this.entities.push(entity);
    entity.init(this);
    this.insertEntity(entity.x >> 4, entity.y >> 4, entity);
  }

  public remove(entity: Entity): void {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
    this.removeEntity(entity.x >> 4, entity.y >> 4, entity);
  }

  public insertEntity(x: number, y: number, e: Entity): void {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) {
      this.entitiesInTiles[x + y * this.w].push(e);
    }
  }

  public removeEntity(x: number, y: number, e: Entity): void {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) {
      const list = this.entitiesInTiles[x + y * this.w];
      const index = list.indexOf(e);
      if (index !== -1) list.splice(index, 1);
    }
  }

  public changeLevel(dir: number): void {
    if (this.onLevelChange) this.onLevelChange(dir);
  }

  public isFree(x: number, y: number, xr: number, yr: number, e: Entity | null = null): boolean {
    let x0 = (x - xr) >> 4;
    let x1 = (x + xr) >> 4;
    let y0 = (y - yr) >> 4;
    let y1 = (y + yr) >> 4;
    for (let yt = y0; yt <= y1; yt++) {
      for (let xt = x0; xt <= x1; xt++) {
        if (xt < 0 || yt < 0 || xt >= this.w || yt >= this.h) continue;
        const t = Tile.tiles[this.map[xt + yt * this.w]];
        if (t && !t.mayPass(this, xt, yt, e)) return false;
      }
    }
    return true;
  }

  public hurtTile(x: number, y: number, dmg: number, dir: number): void {
    const t = Tile.tiles[this.map[x + y * this.w]];
    if (t) t.hurt(this, x, y, null, dmg, dir);
  }

  public setTile(x: number, y: number, t: number, d: number): void {
    this.map[x + y * this.w] = t;
    this.data[x + y * this.w] = d;
  }

  public getTile(x: number, y: number): Tile {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return Tile.tiles[1]; // Rock
    return Tile.tiles[this.map[x + y * this.w]] || Tile.tiles[0]; // fallback
  }

  public tick(input: Input): void {
    this.tickCount++;
    if (this.tickCount % this.monsterDensity === 0 && this.entities.length < 500) {
      this.trySpawn(1);
    }

    // Tile ticking
    for (let i = 0; i < (this.w * this.h) / 50; i++) {
        let xt = Math.floor(Math.random() * this.w);
        let yt = Math.floor(Math.random() * this.h);
        const t = Tile.tiles[this.map[xt + yt * this.w]];
        if (t && t.tick) t.tick(this, xt, yt);
    }
    
    for (let i = 0; i < this.entities.length; i++) {
      const e = this.entities[i];
      let xto = e.x >> 4;
      let yto = e.y >> 4;

      e.tick(input);

      if (e.removed) {
        this.entities.splice(i--, 1);
        this.removeEntity(xto, yto, e);
      } else {
        let xtn = e.x >> 4;
        let ytn = e.y >> 4;
        if (xto !== xtn || yto !== ytn) {
          this.removeEntity(xto, yto, e);
          this.insertEntity(xtn, ytn, e);
        }
      }
    }
  }

  public trySpawn(count: number): void {
    for (let i = 0; i < count; i++) {
      let x = Math.floor(Math.random() * this.w);
      let y = Math.floor(Math.random() * this.h);
      
      if (this.player) {
        let xd = (x * 16 + 8) - this.player.x;
        let yd = (y * 16 + 8) - this.player.y;
        if (xd * xd + yd * yd < 80 * 80) continue;
      }

      if (this.isFree(x * 16 + 8, y * 16 + 8, 4, 4)) {
        let mob: Entity | null = null;
        let lvl = 1;
        if (this.depth < 0) lvl = -this.depth + 1;
        
        if (this.depth === 0) {
            let r = Math.floor(Math.random() * 5);
            let light = this.player ? this.player.lightlvl2 : 12;
            
            if (r === 0 && light < 7) mob = new Slime(lvl);
            else if (r === 1 && light < 7) mob = new Zombie(lvl);
            else if (r === 2 && light < 7) mob = new Skeleton(lvl);
            else if (r === 3) mob = new Pigeon(); // Pigeons replace chickens for now
            else if (r === 4) mob = new Pigeon();
            else if (light < 7) mob = new Skeleton(lvl);
            else mob = new Pigeon();
        } else {
            let r = Math.floor(Math.random() * 3);
            if (r === 0) mob = new Slime(lvl);
            else if (r === 1) mob = new Skeleton(lvl);
            else mob = new Zombie(lvl);
        }

        if (mob) {
            mob.x = x * 16 + 8;
            mob.y = y * 16 + 8;
            this.add(mob);
        }
      }
    }
  }

  public getEntities(x0: number, y0: number, x1: number, y1: number): Entity[] {
    let result: Entity[] = [];
    let xt0 = (x0 >> 4) - 1;
    let yt0 = (y0 >> 4) - 1;
    let xt1 = (x1 >> 4) + 1;
    let yt1 = (y1 >> 4) + 1;
    for (let y = yt0; y <= yt1; y++) {
      for (let x = xt0; x <= xt1; x++) {
        if (x >= 0 && y >= 0 && x < this.w && y < this.h) {
          const entities = this.entitiesInTiles[x + y * this.w];
          for (const e of entities) {
            if (e.intersects(x0, y0, x1, y1)) {
              result.push(e);
            }
          }
        }
      }
    }
    return result;
  }

  public renderTiles(screen: Screen, xScroll: number, yScroll: number): void {
    let x0 = xScroll >> 4;
    let y0 = yScroll >> 4;
    let x1 = (xScroll + screen.w + 15) >> 4;
    let y1 = (yScroll + screen.h + 15) >> 4;

    screen.setOffset(xScroll, yScroll);

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const id = (x < 0 || y < 0 || x >= this.w || y >= this.h) ? 1 : this.map[x + y * this.w];
        const t = Tile.tiles[id];
        if (t) t.render(screen, this, x, y);
      }
    }
  }

  public renderEntities(screen: Screen): void {
    this.entities.sort((a, b) => a.y - b.y);
    for (const e of this.entities) {
      e.render(screen);
    }
  }

  public renderLight(screen: Screen, xScroll: number, yScroll: number, bonus: number): void {
    let xo = xScroll >> 4;
    let yo = yScroll >> 4;
    let w = (screen.w + 15) >> 4;
    let h = (screen.h + 15) >> 4;
    
    screen.setOffset(xScroll, yScroll);
    for (let y = yo - 4; y <= h + yo + 4; y++) {
      for (let x = xo - 4; x <= w + xo + 4; x++) {
        if (x >= 0 && y >= 0 && x < this.w && y < this.h) {
          const entities = this.entitiesInTiles[x + y * this.w];
          for (const e of entities) {
            let lr = (e as any).getLightRadius ? (e as any).getLightRadius() : 0;
            if (e.constructor.name === "Player" && bonus > 0) lr += bonus;
            if (lr > 0) screen.renderLight(e.x - 1, e.y - 4, lr * 8);
          }
          const t = Tile.tiles[this.map[x + y * this.w]];
          if (t && t.getLightRadius) {
            let lr = t.getLightRadius(this, x, y);
            if (lr > 0) screen.renderLight(x * 16 + 8, y * 16 + 8, lr * 8);
          }
        }
      }
    }
    screen.setOffset(0, 0);
  }
}
