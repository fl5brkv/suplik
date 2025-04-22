export type USelectServicesProducts =
  | {type: 'label'; label: string}
  | {type: 'item'; label: string; id: number}
  | {type: 'separator'};
