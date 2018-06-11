// @flow
import type Shape from '../document/shapes/Shape';

export type Idle = {|
  type: 'Idle',
|};

export type CreateShape = {|
  type: 'CreateShape',
  shape: Shape,
|};

export type ShapeSelected = {|
  type: 'ShapeSelected',
  shape: Shape,
|};

export type EditorState = Idle | CreateShape | ShapeSelected;
