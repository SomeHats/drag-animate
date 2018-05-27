// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
});

type Props = {
  classes: { [string]: string },
};

const HeadBar = ({ classes }: Props) => (
  <AppBar position="absolute" className={classes.appBar}>
    <Toolbar>
      <Typography variant="title" color="inherit">
        Drag Animate
      </Typography>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(HeadBar);
