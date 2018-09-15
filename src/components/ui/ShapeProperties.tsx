// @flow
import React from 'react';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Shape from '../../document/shapes/Shape';
import Editor from '../../editor/Editor';
import ColorPicker from './ColorPicker';

const styles = (theme: Theme) =>
  createStyles({
    gutters: {
      paddingRight: theme.spacing.unit * 2,
    },
    nested: {
      paddingLeft: theme.spacing.unit * 2,
    },
    input: {
      width: theme.spacing.unit * 8,
    },
    item: {
      height: theme.spacing.unit * 7,
    },
  });

interface ShapePropertiesProps extends WithStyles<typeof styles> {
  shape: Shape;
  editor: Editor;
}

class ShapeProperties extends React.Component<ShapePropertiesProps> {
  @action
  onToggleStroke = debounce(() => {
    const { style } = this.props.shape;
    style.hasStroke = !style.hasStroke;
  }, 0);

  @action
  onToggleFill = debounce(() => {
    const { style } = this.props.shape;
    style.hasFill = !style.hasFill;
  }, 0);

  @action
  onChangeStrokeWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.currentTarget.value);
    if (!isNaN(value)) {
      this.props.shape.style.strokeWidth = value;
    }
  };

  @action
  onChangeStrokeColor = (color: string) => {
    this.props.shape.style.strokeColor = color;
  };

  @action
  onChangeFillColor = (color: string) => {
    this.props.shape.style.fillColor = color;
  };

  @action
  onBringForward = () => {
    const { shape, editor } = this.props;
    const allShapes = editor.scene.shapes;
    const shapeIndex = allShapes.indexOf(shape);
    if (shapeIndex !== -1 && shapeIndex < allShapes.length) {
      const swapShape = allShapes[shapeIndex + 1];
      allShapes[shapeIndex] = swapShape;
      allShapes[shapeIndex + 1] = shape;
    }
  };

  @action
  onSendBackward = () => {
    const { shape, editor } = this.props;
    const allShapes = editor.scene.shapes;
    const shapeIndex = allShapes.indexOf(shape);
    if (shapeIndex > 0) {
      const swapShape = allShapes[shapeIndex - 1];
      allShapes[shapeIndex] = swapShape;
      allShapes[shapeIndex - 1] = shape;
    }
  };

  render() {
    const { shape, classes, editor } = this.props;
    const { hasStroke, hasFill, strokeWidth } = shape.style;
    const allShapes = editor.scene.shapes;
    const shapeIndex = allShapes.indexOf(shape);
    const isFirstShape = shapeIndex === 0;
    const isLastShape = shapeIndex === allShapes.length - 1;

    return (
      <List subheader={<ListSubheader>Shape Properties</ListSubheader>}>
        <ListItem classes={{ gutters: classes.gutters }}>
          <ListItemText>Arrange</ListItemText>
          <ListItemSecondaryAction>
            <IconButton
              aria-label="Bring forward"
              disabled={isLastShape}
              onClick={this.onBringForward}
            >
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton
              aria-label="Send back"
              disabled={isFirstShape}
              onClick={this.onSendBackward}
            >
              <ArrowDownwardIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem
          classes={{ gutters: classes.gutters }}
          onClick={this.onToggleStroke}
          button
        >
          <ListItemText>Outline</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={hasStroke} onChange={this.onToggleStroke} />
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={hasStroke} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.nested}>
            <ListItem>
              <ListItemText>Width</ListItemText>
              <TextField
                className={classes.input}
                type="number"
                value={strokeWidth}
                onChange={this.onChangeStrokeWidth}
                inputProps={{ step: 0.1 }}
              />
            </ListItem>
            <ListItem className={classes.item}>
              <ListItemText>Colour</ListItemText>
              <ColorPicker
                value={shape.style.strokeColor}
                onChange={this.onChangeStrokeColor}
              />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          classes={{ gutters: classes.gutters }}
          onClick={this.onToggleFill}
          button
        >
          <ListItemText>Fill</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={hasFill} onChange={this.onToggleFill} />
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={hasFill} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.nested}>
            <ListItem className={classes.item}>
              <ListItemText>Colour</ListItemText>
              <ColorPicker
                value={shape.style.fillColor}
                onChange={this.onChangeFillColor}
              />
            </ListItem>
          </List>
        </Collapse>
      </List>
    );
  }
}

export default withStyles(styles)(observer(ShapeProperties));
