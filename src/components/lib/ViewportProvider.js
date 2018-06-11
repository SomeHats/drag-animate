// @flow
import * as React from 'react';
import invariant from 'invariant';
import type Viewport from '../../models/editor/Viewport';
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

export const ViewportProvider = ({
  viewport,
  children,
}: {
  viewport: Viewport,
  children: React.Node,
}): React.Node => <Provider value={viewport}>{children}</Provider>;

export const withViewport = <Props: {}>(
  Component: React.ComponentType<Props>
): React.ComponentType<
  $Diff<Props, { viewport: Viewport | void }>
> => props => (
  <ViewportConsumer>
    {viewport => <Component {...props} viewport={viewport} />}
  </ViewportConsumer>
);
