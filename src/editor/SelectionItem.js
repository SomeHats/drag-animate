// @flow
import type Shape from '../document/shapes/Shape';
import type MagicPointThingy from '../document/MagicPointThingy';

export type ShapeSelectionItem = {
  +type: 'ShapeSelectionItem',
  +shape: Shape,
};

export type MagicPointThingySelectionItem = {
  +type: 'MagicPointThingySelectionItem',
  +point: MagicPointThingy,
  +inShape: Shape,
};

export type SelectionItem = ShapeSelectionItem | MagicPointThingySelectionItem;
