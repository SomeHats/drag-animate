// @flow
import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import type Editor from '../models/editor/Editor';
import ViewportProvider from './lib/ViewportProvider';
import HeadBar from './ui/HeadBar';
import ShapeDrawer from './ui/ShapeDrawer';
import GridCanvas from './guides/GridCanvas';
import KeyPoints from './guides/KeyPoints';
import EditorStateInteraction from './interactions/EditorStateInteraction';
import SceneRenderer from './scene/SceneRenderer';

type Props = {
  editor: Editor,
};

class App extends React.Component<Props, void> {
  render() {
    const { editor } = this.props;
    return (
      <Fragment>
        <HeadBar />
        <ViewportProvider scene={editor.scene}>
          <SceneRenderer scene={editor.scene} />
          <GridCanvas scene={editor.scene} />
          <KeyPoints scene={editor.scene} />
          <EditorStateInteraction editor={editor} />
        </ViewportProvider>
        <ShapeDrawer editor={editor} />
      </Fragment>
    );
  }
}

export default observer(App);
