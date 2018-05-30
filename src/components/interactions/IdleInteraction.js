// @flow
import React from 'react';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import pink from '@material-ui/core/colors/pink';

import ViewortCanvas, type {Viewport} from '../lib/ViewportCanvas';
import Vector2 from '../../models/Vector2';
import * as PointHelpers from '../../canvas/PointHelpers';

type Props = {editor: Editor};

// TODO: pull this out somewhere
const SNAP_THRESOLD = 7;

class IdleInteraction extends React.Component<Props> {
  
}