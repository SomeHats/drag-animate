import React from 'react';
import { observer } from 'mobx-react';
import Editor from '../editor/Editor';
import { ViewportProvider } from './viewport/ViewportProvider';
import HeadBar from './ui/HeadBar';
import ShapeDrawer from './ui/ShapeDrawer';
import ControlBar from './ui/ControlBar';
import GridCanvas from './guides/GridCanvas';
import EditorTool from './tools/EditorTool';
import SceneRenderer from './scene/SceneRenderer';
import BaseTrackyThing from './BaseTrackyThing';

interface AppProps {
  editor: Editor;
}

class App extends React.Component<AppProps> {
  render() {
    const { editor } = this.props;
    return (
      <>
        <HeadBar />
        <ControlBar editor={editor} />
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
          <EditorTool />
        </ViewportProvider>
      </>
    );
  }
}

export default observer(App);
