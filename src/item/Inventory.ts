import { ResourceItem } from '@/item/ResourceItem';
import type { Item } from '@/item/Item';
import type { Resource } from '@/item/resource/Resource';

export class Inventory {
  public items: Item[];

  constructor() {
    this.items = [];
  }

  public add(item: Item): void {
    if (item instanceof ResourceItem) {
      let has = this.findResource(item.resource);
      if (has) {
        has.count += item.count;
        return;
      }
    }
    this.items.push(item);
  }

  public findResource(resource: Resource): ResourceItem | null {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item instanceof ResourceItem) {
        if (item.resource === resource) return item;
      }
    }
    return null;
  }

  public hasResources(resource: Resource, count: number): boolean {
    let r = this.findResource(resource);
    if (!r) return false;
    return r.count >= count;
  }

  public removeResource(resource: Resource, count: number): void {
    let r = this.findResource(resource);
    if (r) {
      r.count -= count;
      if (r.count <= 0) {
        this.items.splice(this.items.indexOf(r), 1);
      }
    }
  }

  public count(item: Item): number {
    if (item instanceof ResourceItem) {
        let r = this.findResource(item.resource);
        return r ? r.count : 0;
    }
    let c = 0;
    for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].name === item.name) c++;
    }
    return c;
  }
}
