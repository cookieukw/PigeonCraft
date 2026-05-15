import { GrassTile } from '@/level/tile/GrassTile';
import { RockTile } from '@/level/tile/RockTile';
import { WaterTile } from '@/level/tile/WaterTile';
import { FlowerTile } from '@/level/tile/FlowerTile';
import { TreeTile } from '@/level/tile/TreeTile';
import { DirtTile } from '@/level/tile/DirtTile';
import { SandTile } from '@/level/tile/SandTile';
import { LavaTile } from '@/level/tile/LavaTile';
import { StairsTile } from '@/level/tile/StairsTile';
import { CloudTile } from '@/level/tile/CloudTile';
import { OreTile } from '@/level/tile/OreTile';
import { FarmlandTile } from '@/level/tile/FarmlandTile';
import { WheatTile } from '@/level/tile/WheatTile';
import { HardRockTile } from '@/level/tile/HardRockTile';
import { HoleTile } from '@/level/tile/HoleTile';
import { WoodPlankTile } from '@/level/tile/WoodPlankTile';
import { WoodWallTile } from '@/level/tile/WoodWallTile';
import { WoodDoorTile } from '@/level/tile/WoodDoorTile';
import { Resources } from '@/item/resource/Resource';
import type { Tile } from '@/level/tile/Tile';

// Initialize basic tiles
export const Tiles: Record<string, Tile> = {
  grass: new GrassTile(0),
  rock: new RockTile(1),
  water: new WaterTile(2),
  flower: new FlowerTile(3),
  tree: new TreeTile(4),
  dirt: new DirtTile(5),
  sand: new SandTile(6),
  cactus: new RockTile(7),
  lava: new LavaTile(13),
  stairsDown: new StairsTile(14, false),
  stairsUp: new StairsTile(15, true),
  cloud: new CloudTile(16),
  ironOre: new OreTile(17, Resources.ironOre),
  goldOre: new OreTile(18, Resources.goldOre),
  farmland: new FarmlandTile(11),
  wheat: new WheatTile(12),
  hardRock: new HardRockTile(19),
  hole: new HoleTile(8),
  woodPlank: new WoodPlankTile(20),
  woodWall: new WoodWallTile(21),
  woodDoor: new WoodDoorTile(22),
};
