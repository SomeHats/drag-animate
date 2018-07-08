// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { withViewport, type Viewport } from '../viewport/ViewportProvider';
import KeyPoint from './KeyPoint';

type Props = {
  viewport: Viewport,
};

class KeyPoints extends React.Component<Props> {
  render() {
    const { keyPointSet } = this.props.viewport.scene;
    return (
      <>
        {keyPointSet.keyPoints.map(keyPoint => (
          <KeyPoint keyPoint={keyPoint} key={String(keyPoint.id)} />
        ))}
      </>
    );
  }
}

export default withViewport(observer(KeyPoints));
