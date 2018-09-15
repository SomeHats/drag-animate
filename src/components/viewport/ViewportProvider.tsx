// @flow
import * as React from 'react';
import reactDisplayName from 'react-display-name';
import { observer } from 'mobx-react';
import { Subtract } from 'utility-types';
import { assertExists, crash } from '../../util';
import PointableCover from '../../lib/PointableCover';
import Editor from '../../editor/Editor';
import Viewport from '../../editor/Viewport';
export { default as Viewport } from '../../editor/Viewport';

const { Provider, Consumer } = React.createContext(null as Viewport | null);

interface ViewportConsumerProps {
  children: (viewport: Viewport) => React.ReactNode;
}

export const ViewportConsumer = ({ children }: ViewportConsumerProps) => (
  <Consumer>{viewport => children(assertExists(viewport))}</Consumer>
);

interface ViewportProviderProps {
  editor: Editor;
  children: React.ReactNode;
  style: React.CSSProperties;
}

interface ViewportProviderState {
  viewport: null | Viewport;
}

@observer
export class ViewportProvider extends React.Component<
  ViewportProviderProps,
  ViewportProviderState
> {
  state: ViewportProviderState = {
    viewport: null,
  };

  sizer: HTMLDivElement | null = null;
  pointableCover: PointableCover | null = null;
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
    assertExists(this.pointableCover).remove();
    window.removeEventListener('resize', this.handleResize);
  }

  setViewportSize(viewport: Viewport | null) {
    if (!viewport) throw crash('viewport must exist');
    const container = assertExists(this.sizer);

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
    const viewport = assertExists(this.state.viewport);
    this.isPointerDown = true;
    assertExists(this.pointableCover).attach();
    viewport.pointer.triggerPointerDown();
  };

  handleMouseMove = (e: { clientX: number; clientY: number }) => {
    const viewport = assertExists(this.state.viewport);
    viewport.pointer.setPosition(e.clientX, e.clientY);
    viewport.pointer.triggerPointerMove();
  };

  handleMouseUp = () => {
    const viewport = assertExists(this.state.viewport);
    this.isPointerDown = false;
    assertExists(this.pointableCover).remove();
    viewport.pointer.triggerPointerUp();

    const screenPosition = assertExists(viewport.pointer.screenPosition);
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
    const viewport = assertExists(this.state.viewport);

    // if the pointer's down, the mouseleave event is because of the
    // PointableCover getting attached over the document
    if (!this.isPointerDown) {
      viewport.pointer.clearPosition();
    }
  };

  handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { deltaX, deltaY, ctrlKey } = e;
    const { viewport } = this.state;
    if (!viewport) return;

    if (ctrlKey) {
      viewport.zoom += viewport.zoom * 0.01 * -deltaY;
    } else {
      viewport.panX -= deltaX;
      viewport.panY -= deltaY;
    }
  };

  renderViewport(viewport: Viewport) {
    const { children, editor } = this.props;
    if (viewport.editor !== editor) crash('prop editor must not change');

    return <Provider value={viewport}>{children}</Provider>;
  }

  render() {
    const { style, children, editor } = this.props;
    const { viewport } = this.state;

    if (viewport) {
      if (viewport.editor !== editor) crash('prop editor must not change');
    }

    const cursor = viewport ? viewport.pointer.cursor : 'default';
    return (
      <>
        {viewport && <Provider value={viewport}>{children}</Provider>}
        <div
          ref={this.sizerRef}
          style={{ ...style, cursor }}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
          onWheel={this.handleWheel}
        />
      </>
    );
  }
}

export interface WithViewport {
  viewport: Viewport;
}

export const withViewport = <Props extends WithViewport>(
  Component: React.ComponentType<Props>,
) =>
  class extends React.Component<Subtract<Props, WithViewport>> {
    static displayName = `withViewport(${reactDisplayName(Component)})`;
    render() {
      return (
        <ViewportConsumer>
          {viewport => <Component {...this.props} viewport={viewport} />}
        </ViewportConsumer>
      );
    }
  };
