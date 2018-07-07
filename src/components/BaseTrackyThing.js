// @flow
import React, { Fragment } from 'react';
import ViewportCanvas, { type Viewport } from './lib/ViewportCanvas';
import ViewportKey from './lib/ViewportKey';

class BaseTrackyThing extends React.Component<{}> {
  _unsubscribes = [];
  draw = () => {};

  handlePointerMove = ({ keyboard, pointer, basePoint }: Viewport) => {
    if (keyboard.isPressed('ctrl') && pointer.scenePosition) {
      basePoint.set(pointer.scenePosition);
    }
  };

  handleCtrlDown = ({ keyboard, pointer, basePoint }: Viewport) => {
    if (pointer.scenePosition) {
      basePoint.set(pointer.scenePosition);
    }
  };

  handleCtrlUp = ({ basePoint, nearestKeyPoint }: Viewport) => {
    basePoint.set(nearestKeyPoint);
  };

  render() {
    return (
      <Fragment>
        <ViewportCanvas
          draw={this.draw}
          onPointerMove={this.handlePointerMove}
        />
        <ViewportKey
          name="ctrl"
          onDown={this.handleCtrlDown}
          onUp={this.handleCtrlUp}
        />
      </Fragment>
    );
  }
}

export default BaseTrackyThing;
