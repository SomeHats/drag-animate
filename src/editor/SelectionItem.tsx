import Shape from '../document/shapes/Shape';
import ShapePoint from '../document/shapes/ShapePoint';

export enum SelectionItemType {
  Shape = 'shape',
  MagicPointThingy = 'magicPointThingy',
  ControlPoint = 'controlPoint',
}

export interface ShapeSelectionItem {
  type: SelectionItemType.Shape;
  shape: Shape;
}

export interface MagicPointThingySelectionItem {
  type: SelectionItemType.MagicPointThingy;
  point: ShapePoint;
  inShape: Shape;
}

export interface ControlPointSelectionItem {
  type: SelectionItemType.ControlPoint;
  point: ShapePoint;
  inShape: Shape;
  controlPoint: 'leading' | 'following';
}

export type SelectionItem =
  | ShapeSelectionItem
  | MagicPointThingySelectionItem
  | ControlPointSelectionItem;
