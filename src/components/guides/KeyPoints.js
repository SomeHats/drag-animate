// @flow
import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import type Scene from '../../models/document/Scene';
import KeyPoint from './KeyPoint';

type Props = {
  scene: Scene,
};

class KeyPoints extends React.Component<Props> {
  render() {
    const { keyPointSet } = this.props.scene;
    return (
      <Fragment>
        {keyPointSet.keyPoints.map(keyPoint => (
          <KeyPoint keyPoint={keyPoint} key={String(keyPoint.id)} />
        ))}
      </Fragment>
    );
  }
}

export default observer(KeyPoints);
