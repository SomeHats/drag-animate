// @flow
import React from 'react';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
  });

interface HeadBarProps extends WithStyles<typeof styles> {}

const HeadBar = ({ classes }: HeadBarProps) => (
  <AppBar position="absolute" className={classes.appBar}>
    <Toolbar>
      <Typography variant="title" color="inherit">
        Drag Animate
      </Typography>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(HeadBar);
