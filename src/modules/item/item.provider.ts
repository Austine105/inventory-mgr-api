import { ItemModel } from "./item.model";
import { ITEM_REPOSITORY } from "./constants";

export const ItemProvider = [
  {
    provide: ITEM_REPOSITORY,
    useValue: ItemModel,
  },
];
