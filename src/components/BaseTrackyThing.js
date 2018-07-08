// @flow
import React from 'react';
import withExactProps from '../lib/withExactProps';
import ViewportInteraction, {
  type Viewport,
} from './viewport/ViewportInteraction';
import { withViewport } from './viewport/ViewportProvider';
import KeyboardShortcut from './KeyboardShortcut';

type Props = {
  viewport: Viewport,
};

class BaseTrackyThing extends React.Component<Props> {
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

export default withExactProps(withViewport(BaseTrackyThing));
