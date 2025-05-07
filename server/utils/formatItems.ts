import {type ItemSelect} from '../database/schema';

type USelectServicesProducts =
  | {type: 'label'; label: string}
  | {type: 'item'; label: string; id: number}
  | {type: 'separator'};

export const formatItems = (
  selected: ItemSelect[]
): USelectServicesProducts[] => {
  const grouped = new Map<string, USelectServicesProducts[]>();

  selected.forEach((item) => {
    const group = item.group;
    const entry: USelectServicesProducts = {
      type: 'item',
      label: item.name,
      id: ('serviceId' in item ? item.serviceId : item.id) as number,
    };

    if (!grouped.has(group)) {
      grouped.set(group, []);
    }

    grouped.get(group)!.push(entry);
  });

  const result: USelectServicesProducts[] = [];

  const entries = Array.from(grouped.entries());
  entries.forEach(([label, items], idx) => {
    result.push({type: 'label', label});

    result.push(...items);

    if (idx < entries.length - 1) {
      result.push({type: 'separator'});
    }
  });

  return result;
};
