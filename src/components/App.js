// @flow
import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import type Viewport from '../models/editor/Viewport';
import { ViewportProvider } from './lib/ViewportProvider';
import HeadBar from './ui/HeadBar';
import ShapeDrawer from './ui/ShapeDrawer';
import GridCanvas from './guides/GridCanvas';
import KeyPoints from './guides/KeyPoints';
import EditorStateInteraction from './interactions/EditorStateInteraction';
import SceneRenderer from './scene/SceneRenderer';

type Props = {
  viewport: Viewport,
};

class App extends React.Component<Props, void> {
  render() {
    const { viewport } = this.props;
    const { editor } = viewport;
    const { scene } = editor;
    return (
      <Fragment>
        <HeadBar />
        <ViewportProvider viewport={viewport}>
          <SceneRenderer scene={scene} />
          <GridCanvas />
          <KeyPoints scene={scene} />
          <EditorStateInteraction editor={editor} />
        </ViewportProvider>
        <ShapeDrawer editor={editor} />
      </Fragment>
    );
  }
}

export default observer(App);
