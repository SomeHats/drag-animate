// @flow
import type Shape from '../document/shapes/Shape';
import type ShapePoint from '../document/shapes/ShapePoint';

export type ShapeSelectionItem = {
  +type: 'ShapeSelectionItem',
  +shape: Shape,
};

export type MagicPointThingySelectionItem = {
  +type: 'MagicPointThingySelectionItem',
  +point: ShapePoint,
  +inShape: Shape,
};

export type SelectionItem = ShapeSelectionItem | MagicPointThingySelectionItem;
