// @flow
import React from 'react';
import ViewportCanvas, { type Viewport } from './lib/ViewportCanvas';

class BaseTrackyThing extends React.Component<{}> {
  draw = () => {};

  handleMouseMove = (
    e: SyntheticMouseEvent<HTMLCanvasElement>,
    viewport: Viewport
  ) => {
    if (!e.ctrlKey) return;
    viewport.basePoint.set(
      viewport.screenCoordsToSceneCoords(e.clientX, e.clientY)
    );
  };

  render() {
    return (
      <ViewportCanvas draw={this.draw} onMouseMove={this.handleMouseMove} />
    );
  }
}

export default BaseTrackyThing;
