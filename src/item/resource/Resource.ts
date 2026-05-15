import { Color } from '@/engine/Color';
import { Torch } from '@/entity/Torch';


import type { Tile } from '@/level/tile/Tile';
import type { Level } from '@/level/Level';
import type { Player } from '@/entity/Player';

export class Resource {
  public name: string;
  public sprite: number;
  public color: number;
  public interactOn?: (tile: Tile, level: Level, xt: number, yt: number, player: Player) => boolean;

  constructor(name: string, sprite: number, color: number) {
    this.name = name;
    this.sprite = sprite;
    this.color = color;
  }
}

export const Resources = {
  wood: new Resource("Wood", 129, Color.get(-1, 200, 531, 430)),
  stone: new Resource("Stone", 130, Color.get(-1, 111, 333, 555)),
  wheat: new Resource("Wheat", 134, Color.get(-1, 110, 330, 550)),
  apple: new Resource("Apple", 137, Color.get(-1, 100, 300, 500)),
  coal: new Resource("COAL", 138, Color.get(-1, 0, 111, 111)),
  ironOre: new Resource("I.ORE", 138, Color.get(-1, 100, 322, 544)),
  goldOre: new Resource("G.ORE", 138, Color.get(-1, 110, 440, 553)),
  iron: new Resource("IRON", 139, Color.get(-1, 100, 322, 544)),
  gold: new Resource("GOLD", 139, Color.get(-1, 110, 330, 553)),
  slime: new Resource("SLIME", 138, Color.get(-1, 10, 30, 50)),
  gem: new Resource("gem", 141, Color.get(-1, 101, 404, 545)),
  acorn: new Resource("Acorn", 131, Color.get(-1, 100, 531, 320)),
  bread: new Resource("Bread", 135, Color.get(-1, 110, 330, 550)),
  seeds: new Resource("Seeds", 134, Color.get(-1, 10, 40, 50)),
  cloth: new Resource("Cloth", 129, Color.get(-1, 25, 252, 141)),
  wool: new Resource("Wool", 130, Color.get(-1, 111, 444, 555)),
  bone: new Resource("Bone", 144, Color.get(-1, 555, 555, 555)),
  feather: new Resource("Feather", 329, Color.get(-1, 332, 443, 554)),
  rawchicken: new Resource("R.Meat", 146, Color.get(-1, 511, 555, 555)),
  cookedchicken: new Resource("C.Meat", 146, Color.get(-1, 211, 555, 555)),
  arrow: new Resource("Arrow", 332, Color.get(-1, 110, 330, 555)),
  glass: new Resource("Glass", 140, Color.get(-1, 555, 555, 555)),
  dirt: new Resource("Dirt", 132, Color.get(-1, 210, 210, 210)),
  // Placeable items
  woodPlank: new Resource("WoodPlnk", 53, Color.get(-1, 430, 420, 320)),
  woodWall: new Resource("WoodWall", 55, Color.get(-1, 320, 310, 210)),
  woodDoor: new Resource("WoodDoor", 57, Color.get(-1, 430, 420, 320)),
  torch: new Resource("Torch", 142, Color.get(-1, 210, 420, 550)),
};

Resources.seeds.interactOn = (tile, level, xt, yt, _player) => {
    if (tile.id === 11) { // Farmland
        level.setTile(xt, yt, 12, 0); // Wheat
        return true;
    }
    return false;
};

// Placeable construction tiles — use on grass/dirt/sand
const _placeOn = (tileId: number) => (tile: Tile, level: Level, xt: number, yt: number, _player: Player) => {
    if (tile.mayPass && tile.mayPass(level, xt, yt, { canSwim: () => true } as any)) {
        level.setTile(xt, yt, tileId, 0);
        return true;
    }
    return false;
};
Resources.woodPlank.interactOn = _placeOn(20);
Resources.woodWall.interactOn  = _placeOn(21);
Resources.woodDoor.interactOn  = _placeOn(22);


// Torch: place a Torch entity on the target tile if it's passable
Resources.torch.interactOn = (tile: Tile, level: Level, xt: number, yt: number, _player: Player) => {
    if (tile.mayPass && tile.mayPass(level, xt, yt, { canSwim: () => true } as any)) {
        const t = new Torch();
        t.x = xt * 16 + 8;
        t.y = yt * 16 + 8;
        level.add(t);
        return true;
    }
    return false;
};

