// @flow
import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import type Viewport from '../models/editor/Viewport';
import type Editor from '../models/editor/Editor';
import { ViewportProvider } from './lib/ViewportProvider';
import HeadBar from './ui/HeadBar';
import ShapeDrawer from './ui/ShapeDrawer';
import ToolBox from './ui/ToolBox';
import GridCanvas from './guides/GridCanvas';
import KeyPoints from './guides/KeyPoints';
import EditorTool from './tools/EditorTool';
import SceneRenderer from './scene/SceneRenderer';
import BaseTrackyThing from './BaseTrackyThing';

type Props = {| editor: Editor |};

class App extends React.Component<Props, void> {
  render() {
    const { editor } = this.props;
    const { scene } = editor;
    return (
      <Fragment>
        <HeadBar />
        <ToolBox editor={editor} />
        <ShapeDrawer editor={editor} />
        <ViewportProvider
          editor={editor}
          style={{
            position: 'absolute',
            top: 64,
            left: 48,
            right: 300,
            bottom: 0,
          }}
        >
          <SceneRenderer />
          <GridCanvas />
          <BaseTrackyThing />
          <KeyPoints />
          <EditorTool />
        </ViewportProvider>
      </Fragment>
    );
  }
}

export default observer(App);
