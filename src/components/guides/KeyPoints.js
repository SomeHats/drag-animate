// @flow
import React from 'react';
import { observer } from 'mobx-react';
import withExactProps from '../../lib/withExactProps';
import { withViewport, type Viewport } from '../viewport/ViewportProvider';
import KeyPoint from './KeyPoint';

type Props = {
  viewport: Viewport,
  showAll?: boolean,
};

class KeyPoints extends React.Component<Props> {
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

export default withExactProps(withViewport(observer(KeyPoints)));
