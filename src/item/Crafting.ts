import { Recipe } from '@/item/Recipe';
import { ResourceItem } from '@/item/ResourceItem';
import { Resources } from '@/item/resource/Resource';
import { ToolItem, ToolType } from '@/item/ToolItem';
import { FurnitureItem } from '@/item/FurnitureItem';
import { PowerGloveItem } from '@/item/PowerGloveItem';
import { Workbench } from '@/entity/Workbench';
import { Furnace } from '@/entity/Furnace';
import { Oven } from '@/entity/Oven';
import { Lantern } from '@/entity/Lantern';
import { Bed } from '@/entity/Bed';
import { FoodItem } from '@/item/FoodItem';

export const Crafting = {
  workbench: [
    new Recipe(new ToolItem(ToolType.sword, 0)).addCost(Resources.wood, 5),
    new Recipe(new ToolItem(ToolType.axe, 0)).addCost(Resources.wood, 5),
    new Recipe(new ToolItem(ToolType.pickaxe, 0)).addCost(Resources.wood, 5),
    new Recipe(new ToolItem(ToolType.shovel, 0)).addCost(Resources.wood, 5),
    new Recipe(new ToolItem(ToolType.sword, 1)).addCost(Resources.wood, 5).addCost(Resources.stone, 5),
    new Recipe(new ToolItem(ToolType.axe, 1)).addCost(Resources.wood, 5).addCost(Resources.stone, 5),
    new Recipe(new ToolItem(ToolType.pickaxe, 1)).addCost(Resources.wood, 5).addCost(Resources.stone, 5),
    new Recipe(new FurnitureItem(new Oven())).addCost(Resources.stone, 15),
    new Recipe(new FurnitureItem(new Furnace())).addCost(Resources.stone, 20),
    new Recipe(new FurnitureItem(new Lantern())).addCost(Resources.wood, 5).addCost(Resources.iron, 2),
    new Recipe(new FurnitureItem(new Bed())).addCost(Resources.wood, 10).addCost(Resources.wheat, 10),
    // Construction
    new Recipe(new ResourceItem(Resources.woodPlank, 4)).addCost(Resources.wood, 2),
    new Recipe(new ResourceItem(Resources.woodWall, 2)).addCost(Resources.wood, 2),
    new Recipe(new ResourceItem(Resources.woodDoor, 1)).addCost(Resources.wood, 3),
    // Power glove
    new Recipe(new PowerGloveItem()).addCost(Resources.iron, 5).addCost(Resources.wood, 5),
  ],
  inventory: [
    new Recipe(new ResourceItem(Resources.wood, 1)).addCost(Resources.acorn, 2),
    new Recipe(new FurnitureItem(new Workbench())).addCost(Resources.wood, 20),
    // Torch: 1 wood + 1 coal = 4 torches (held, not placed yet — use F to place)
    new Recipe(new ResourceItem(Resources.torch, 4)).addCost(Resources.wood, 1).addCost(Resources.coal, 1),
  ],
  furnace: [
    new Recipe(new ResourceItem(Resources.iron, 1)).addCost(Resources.ironOre, 1).addCost(Resources.coal, 1),
    new Recipe(new ResourceItem(Resources.gold, 1)).addCost(Resources.goldOre, 1).addCost(Resources.coal, 1),
    new Recipe(new ResourceItem(Resources.glass, 1)).addCost(Resources.stone, 3).addCost(Resources.coal, 1),
  ],
  anvil: [
    new Recipe(new ToolItem(ToolType.sword, 2)).addCost(Resources.iron, 5),
    new Recipe(new ToolItem(ToolType.axe, 2)).addCost(Resources.iron, 5),
    new Recipe(new ToolItem(ToolType.pickaxe, 2)).addCost(Resources.iron, 5),
    new Recipe(new ToolItem(ToolType.sword, 3)).addCost(Resources.gold, 5),
    new Recipe(new ToolItem(ToolType.axe, 3)).addCost(Resources.gold, 5),
    new Recipe(new ToolItem(ToolType.pickaxe, 3)).addCost(Resources.gold, 5),
  ],
  oven: [
    new Recipe(new FoodItem(Resources.bread, 10)).addCost(Resources.wheat, 5),
    new Recipe(new FoodItem(Resources.cookedchicken, 8)).addCost(Resources.rawchicken, 1),
  ]
};
