// @flow
import type PolygonShape from '../document/shapes/PolygonShape';

export type Idle = {|
  type: 'Idle',
|};

export type CreatePolygonShape = {|
  type: 'CreatePolygonShape',
  shape: PolygonShape,
|};

export type EditorState = Idle | CreatePolygonShape;
