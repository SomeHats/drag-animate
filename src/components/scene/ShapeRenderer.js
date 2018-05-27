// @flow
import React from 'react';
import type Shape from '../../models/document/shapes/Shape';
import PolygonShape from '../../models/document/shapes/PolygonShape';
import PolygonShapeRenderer from './PolygonShapeRenderer';

type Props = {
  shape: Shape,
};

class ShapeRenderer extends React.Component<Props> {
  render() {
    const { shape } = this.props;
    if (shape instanceof PolygonShape) {
      return <PolygonShapeRenderer shape={shape} />;
    }

    // $FlowFixMe
    throw new Error(`Unknown shape ${shape.prototype.constructor.name}`);
  }
}

export default ShapeRenderer;
