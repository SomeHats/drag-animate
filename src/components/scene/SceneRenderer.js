// @flow
import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import type Scene from '../../models/document/Scene';
import ShapeRenderer from './ShapeRenderer';

type Props = {
  scene: Scene,
};

class SceneRenderer extends React.Component<Props> {
  render() {
    const { scene } = this.props;
    return (
      <Fragment>
        {scene.shapes.map((shape, i) => (
          <ShapeRenderer shape={shape} key={i} />
        ))}
      </Fragment>
    );
  }
}

export default observer(SceneRenderer);
