// @flow
import React from 'react';
import ViewportInteraction, { Viewport } from './viewport/ViewportInteraction';
import { withViewport, WithViewport } from './viewport/ViewportProvider';
import KeyboardShortcut from './KeyboardShortcut';

interface BaseTrackyThingProps extends WithViewport {}

class BaseTrackyThing extends React.Component<BaseTrackyThingProps> {
  _unsubscribes = [];

  handlePointerMove = ({ keyboard, pointer, basePoint }: Viewport) => {
    if (keyboard.isPressed('ctrl') && pointer.scenePosition) {
      basePoint.set(pointer.scenePosition);
    }
  };

  handleCtrlDown = () => {
    const { pointer, basePoint } = this.props.viewport;
    if (pointer.scenePosition) {
      basePoint.set(pointer.scenePosition);
    }
  };

  handleCtrlUp = () => {
    const { basePoint, nearestKeyPoint } = this.props.viewport;
    basePoint.set(nearestKeyPoint);
  };

  render() {
    return (
      <>
        <ViewportInteraction onPointerMove={this.handlePointerMove} />
        <KeyboardShortcut
          name="ctrl"
          onDown={this.handleCtrlDown}
          onUp={this.handleCtrlUp}
        />
      </>
    );
  }
}

export default withViewport(BaseTrackyThing);
