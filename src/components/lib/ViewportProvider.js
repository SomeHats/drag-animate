// @flow
import * as React from 'react';
import invariant from 'invariant';
import type Editor from '../../models/editor/Editor';
import Viewport from '../../models/editor/Viewport';
export type { default as Viewport } from '../../models/editor/Viewport';

const { Provider, Consumer } = React.createContext(null);

export const ViewportConsumer = ({
  children,
}: {
  children: Viewport => React.Node,
}): React.Node => (
  <Consumer>
    {viewport => {
      invariant(viewport, 'Viewport must exist');
      return children(viewport);
    }}
  </Consumer>
);

type ProviderProps = {|
  editor: Editor,
  children: React.Node,
  style: Object,
|};

type ProviderState = {|
  viewport: null | Viewport,
|};

export class ViewportProvider extends React.Component<
  ProviderProps,
  ProviderState
> {
  state = {
    viewport: null,
  };

  sizer: HTMLDivElement | null = null;

  componentDidMount() {
    const viewport = new Viewport(this.props.editor);
    this.setState({ viewport });
    this.setViewportSize(viewport);
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    this.setViewportSize(this.state.viewport);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  setViewportSize(viewport: Viewport | null) {
    const container = this.sizer;
    invariant(container, 'container must be set');
    invariant(viewport, 'viewport must be set');

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const { left, top, right, bottom } = container.getBoundingClientRect();

    viewport.setSize(
      windowWidth,
      windowHeight,
      devicePixelRatio,
      left,
      top,
      windowWidth - right,
      windowHeight - bottom
    );
  }

  handleResize = () => {
    this.setViewportSize(this.state.viewport);
  };

  sizerRef = (el: HTMLDivElement | null) => {
    this.sizer = el;
  };

  renderViewport(viewport: Viewport) {
    const { children, editor } = this.props;
    invariant(viewport.editor === editor, 'prop editor must not change');

    return <Provider value={viewport}>{children}</Provider>;
  }

  handleMouseDown = () => {
    const { viewport } = this.state;
    invariant(viewport, 'viewport must exist');
    viewport.pointer.triggerPointerDown();
  };

  handleMouseMove = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    const { viewport } = this.state;
    invariant(viewport, 'viewport must exist');
    viewport.pointer.setPosition(e.clientX, e.clientY);
    viewport.pointer.triggerPointerMove();
  };

  handleMouseUp = () => {
    const { viewport } = this.state;
    invariant(viewport, 'viewport must exist');
    viewport.pointer.triggerPointerUp();
  };

  handleMouseLeave = () => {
    const { viewport } = this.state;
    invariant(viewport, 'viewport must exist');
    viewport.pointer.clearPosition();
  };

  render() {
    const { style } = this.props;
    const { viewport } = this.state;

    return (
      <React.Fragment>
        {viewport && this.renderViewport(viewport)}
        <div
          ref={this.sizerRef}
          style={style}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
        />
      </React.Fragment>
    );
  }
}

export const withViewport = <Props: {}>(
  Component: React.ComponentType<Props>
): React.ComponentType<
  $Diff<Props, { viewport: Viewport | void }>
> => props => (
  <ViewportConsumer>
    {viewport => <Component {...props} viewport={viewport} />}
  </ViewportConsumer>
);
