// @flow
import * as React from 'react';
import invariant from 'invariant';
import reactDisplayName from 'react-display-name';
import PointableCover from '../../lib/PointableCover';
import type Editor from '../../editor/Editor';
import Viewport from '../../editor/Viewport';
export type { default as Viewport } from '../../editor/Viewport';

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
  ProviderState,
> {
  state = {
    viewport: null,
  };

  sizer: HTMLDivElement | null = null;
  pointableCover: PointableCover;
  isPointerDown: boolean = false;

  componentDidMount() {
    this.pointableCover = new PointableCover({
      down: this.handleMouseDown,
      move: this.handleMouseMove,
      up: this.handleMouseUp,
    });

    const viewport = new Viewport(this.props.editor);
    this.setState({ viewport });
    this.setViewportSize(viewport);
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    this.setViewportSize(this.state.viewport);
  }

  componentWillUnmount() {
    this.pointableCover.remove();
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
      windowHeight - bottom,
    );
  }

  handleResize = () => {
    this.setViewportSize(this.state.viewport);
  };

  sizerRef = (el: HTMLDivElement | null) => {
    this.sizer = el;
  };

  handleMouseDown = () => {
    const { viewport } = this.state;
    invariant(viewport, 'viewport must exist');
    this.isPointerDown = true;
    this.pointableCover.attach();
    viewport.pointer.triggerPointerDown();
  };

  handleMouseMove = (e: MouseEvent) => {
    const { viewport } = this.state;
    invariant(viewport, 'viewport must exist');
    viewport.pointer.setPosition(e.clientX, e.clientY);
    viewport.pointer.triggerPointerMove();
  };

  handleMouseUp = () => {
    const { viewport } = this.state;
    invariant(viewport, 'viewport must exist');
    this.isPointerDown = false;
    this.pointableCover.remove();
    viewport.pointer.triggerPointerUp();

    const screenPosition = viewport.pointer.screenPosition;
    invariant(screenPosition, 'viewport pointer must be active');
    if (
      viewport.left > screenPosition.x ||
      screenPosition.x > viewport.windowWidth - viewport.right ||
      viewport.top > screenPosition.y ||
      screenPosition.y > viewport.windowHeight - viewport.bottom
    ) {
      // we've left the viewport now, so lets deactivate the viewport pointer
      viewport.pointer.clearPosition();
    }
  };

  handleMouseLeave = () => {
    const { viewport } = this.state;
    invariant(viewport, 'viewport must exist');

    // if the pointer's down, the mouseleave event is because of the
    // PointableCover getting attached over the document
    if (!this.isPointerDown) {
      viewport.pointer.clearPosition();
    }
  };

  renderViewport(viewport: Viewport) {
    const { children, editor } = this.props;
    invariant(viewport.editor === editor, 'prop editor must not change');

    return <Provider value={viewport}>{children}</Provider>;
  }

  render() {
    const { style, children, editor } = this.props;
    const { viewport } = this.state;

    if (viewport) {
      invariant(viewport.editor === editor, 'prop editor must not change');
    }

    return (
      <>
        {viewport && <Provider value={viewport}>{children}</Provider>}
        <div
          ref={this.sizerRef}
          style={style}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
        />
      </>
    );
  }
}

export const withViewport = <Props: {}>(
  Component: React.ComponentType<Props>,
): React.ComponentType<$Diff<Props, { viewport: Viewport | void }>> =>
  class extends React.Component<Props> {
    static displayName = `withViewport(${reactDisplayName(Component)})`;
    render() {
      return (
        <ViewportConsumer>
          {viewport => <Component {...this.props} viewport={viewport} />}
        </ViewportConsumer>
      );
    }
  };
