// @flow
import React from "react";
import cx from "classnames";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ChromeColorPicker from "react-color/lib/Chrome";
import withExactProps from "../../lib/withExactProps";

const rgba = ({ rgb }) => {
  if (typeof rgb.a === "number") {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
  }
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

const styles = theme => ({
  container: {
    position: "relative"
  },
  popper: {
    zIndex: theme.zIndex.tooltip,

    marginTop: theme.spacing.unit
  },
  button: {
    boxShadow: theme.shadows[1],
    "&:active": {
      boxShadow: theme.shadows[3]
    }
  }
});

type Props = {
  value: string,
  onChange: string => mixed,
  classes: { [string]: string },
  className?: string
};

type State = {
  anchor: HTMLElement | null,
  isOpen: boolean
};

class ColorPicker extends React.Component<Props, State> {
  state = {
    anchor: null,
    isOpen: false
  };

  onChange = color => {
    this.props.onChange(rgba(color));
  };

  onClickButton = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  onClose = () => {
    this.setState({ isOpen: false });
  };

  buttonRef = el => {
    this.setState({ anchor: el || null });
  };

  render() {
    const { value, classes, className } = this.props;
    const { isOpen, anchor } = this.state;
    return (
      <div className={cx(classes.container, className)}>
        <Button
          buttonRef={this.buttonRef}
          className={classes.button}
          style={{ background: value }}
          onClick={this.onClickButton}
          variant="fab"
          mini
        >
          {" "}
        </Button>
        {anchor && (
          <Popover
            className={classes.popper}
            open={isOpen}
            anchorEl={anchor}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={this.onClose}
          >
            <ChromeColorPicker color={value} onChangeComplete={this.onChange} />
          </Popover>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(ColorPicker);
