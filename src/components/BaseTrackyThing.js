// @flow
import React from 'react';
import ViewportInteraction, {
  type Viewport,
} from './viewport/ViewportInteraction';
import ViewportKey from './viewport/ViewportKey';

class BaseTrackyThing extends React.Component<{}> {
  _unsubscribes = [];

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
      <>
        <ViewportInteraction onPointerMove={this.handlePointerMove} />
        <ViewportKey
          name="ctrl"
          onDown={this.handleCtrlDown}
          onUp={this.handleCtrlUp}
        />
      </>
    );
  }
}

export default BaseTrackyThing;
