// @flow
import * as React from 'react';

const withExactProps = <Props: {}>(
  Component: React.ComponentType<Props>,
): React.ComponentType<$Exact<Props>> => {
  // $FlowFixMe - this HOC exists purely as a hint to flow
  return Component;
};

export default withExactProps;
