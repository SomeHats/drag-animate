// @flow
import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { withViewport, type Viewport } from '../viewport/ViewportProvider';
import ShapeRenderer from './ShapeRenderer';

type Props = {
  viewport: Viewport,
};

class SceneRenderer extends React.Component<Props> {
  render() {
    const { viewport } = this.props;
    const scene = viewport.editor.scene;
    return (
      <Fragment>
        {scene.shapes.map((shape, i) => (
          <ShapeRenderer shape={shape} key={i} />
        ))}
      </Fragment>
    );
  }
}

export default withViewport(observer(SceneRenderer));
