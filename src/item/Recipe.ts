import type { Item } from '@/item/Item';
import type { Resource } from '@/item/resource/Resource';
import type { Inventory } from '@/item/Inventory';

export interface ICost {
  resource: Resource;
  count: number;
}

export class Recipe {
  public resultItem: Item;
  public costs: ICost[];

  constructor(resultItem: Item) {
    this.resultItem = resultItem;
    this.costs = [];
  }

  public addCost(resource: Resource, count: number): this {
    this.costs.push({ resource, count });
    return this;
  }

  public checkCanCraft(inventory: Inventory): boolean {
    for (const cost of this.costs) {
      if (!(inventory as any).hasResources(cost.resource, cost.count)) return false;
    }
    return true;
  }

  public craft(inventory: Inventory): boolean {
    if (this.checkCanCraft(inventory)) {
      for (const cost of this.costs) {
        (inventory as any).removeResource(cost.resource, cost.count);
      }
      inventory.add(this.resultItem);
      return true;
    }
    return false;
  }
}
