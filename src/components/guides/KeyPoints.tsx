// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { withViewport, Viewport } from '../viewport/ViewportProvider';
import KeyPoint from './KeyPoint';

interface KeyPointsProps {
  viewport: Viewport;
  showAll?: boolean;
}

class KeyPoints extends React.Component<KeyPointsProps> {
  render() {
    const { viewport, showAll } = this.props;
    const { keyPointSet } = viewport.scene;
    const activeKeyPoint = viewport.nearestKeyPoint;
    const shouldShowAll = showAll || viewport.keyboard.isPressed('ctrl');

    return (
      <>
        {keyPointSet.keyPoints
          .filter(
            keyPoint => (shouldShowAll ? true : keyPoint === activeKeyPoint),
          )
          .map(keyPoint => (
            <KeyPoint keyPoint={keyPoint} key={String(keyPoint.id)} />
          ))}
      </>
    );
  }
}

export default withViewport(observer(KeyPoints));
