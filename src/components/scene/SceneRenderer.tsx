// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { withViewport, Viewport } from '../viewport/ViewportProvider';
import ShapeRenderer from './ShapeRenderer';

interface SceneRendererProps {
  viewport: Viewport;
}

class SceneRenderer extends React.Component<SceneRendererProps> {
  render() {
    const { viewport } = this.props;
    const scene = viewport.editor.scene;
    return (
      <>
        {scene.shapes.map((shape, i) => (
          <ShapeRenderer shape={shape} key={i} />
        ))}
      </>
    );
  }
}

export default withViewport(observer(SceneRenderer));
