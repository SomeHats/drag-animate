// @flow
import * as React from 'react';

export type InjectedProps = {
  windowWidth: number,
  windowHeight: number,
  devicePixelRatio: number,
};

type State = {|
  windowWidth: ?number,
  windowHeight: ?number,
  devicePixelRatio: ?number,
  render: boolean,
|};

export const getViewportSize = (): {
  windowWidth: number,
  windowHeight: number,
  devicePixelRatio: number,
} => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio;

  return {
    windowWidth,
    windowHeight,
    devicePixelRatio,
  };
};

const withSize = <Props: {}>(
  Component: React.ComponentType<InjectedProps & Props>
): React.ComponentType<Props> => {
  class WithSize extends React.PureComponent<Props, State> {
    state = {
      windowWidth: null,
      windowHeight: null,
      devicePixelRatio: null,
      render: false,
    };

    componentDidMount() {
      this.measure();
      window.addEventListener('resize', this.handleResize, false);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    measure() {
      const { windowWidth, windowHeight, devicePixelRatio } = getViewportSize();

      if (
        windowWidth !== this.state.windowWidth ||
        windowHeight !== this.state.windowHeight ||
        devicePixelRatio !== this.state.devicePixelRatio
      ) {
        this.setState({
          windowWidth,
          windowHeight,
          devicePixelRatio,
          render: true,
        });
      }
    }

    handleResize = () => {
      this.measure();
    };

    render() {
      const {
        windowWidth,
        windowHeight,
        devicePixelRatio,
        render,
      } = this.state;

      if (!render || windowWidth == null || windowHeight == null) return null;

      return (
        <Component
          {...this.props}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          devicePixelRatio={devicePixelRatio == null ? 1 : devicePixelRatio}
        />
      );
    }
  }

  return WithSize;
};

export default withSize;
