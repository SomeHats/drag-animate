// @flow
import React from 'react';
import { observer } from 'mobx-react';
import type Editor from '../editor/Editor';
import { ViewportProvider } from './viewport/ViewportProvider';
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
    return (
      <>
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
      </>
    );
  }
}

export default observer(App);
