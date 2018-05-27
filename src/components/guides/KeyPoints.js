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
    const { keyPoints } = this.props.scene;
    return (
      <Fragment>
        {keyPoints.map((keyPoint, i) => (
          <KeyPoint keyPoint={keyPoint} key={i} />
        ))}
      </Fragment>
    );
  }
}

export default observer(KeyPoints);
