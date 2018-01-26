import React from 'react';
import { connect } from "react-redux";
import { terminate } from '../../../logic/app/actions';
import withStyles from 'material-ui/styles/withStyles';
import MANIFEST from '../manifest'
import Button from 'material-ui/Button/Button';
import Settings from 'material-ui-icons/Settings';
import Undo from 'material-ui-icons/Undo';
import Clear from 'material-ui-icons/Clear';
import Palette from 'material-ui-icons/Palette';
import SketchCanvas from '../components/SketchCanvas';
import { sketch, undo, clear } from '../actions';
import IconButton from 'material-ui/IconButton/IconButton';
import { CirclePicker } from 'react-color'
import Modal from 'material-ui/Modal/Modal';
import ColorPickerModal from '../components/ColorPickerModal';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    height: '100%',
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  headline: {
    paddingBottom: theme.spacing.unit * 2
  },
  settingsButton: {
    position: 'absolute',
    top: '10px',
    right: '10px'
  },
  undoButton: {
    position: 'absolute',
    bottom: '10px',
    right: '50px'
  },
  clearButton: {
    position: 'absolute',
    bottom: '10px',
    right: '90px'
  },
  paletteButton: {
    position: 'absolute',
    bottom: '10px',
    right: '10px'
  },
  canvasContainer: {
    backgroundColor: '#fff'
  }
});


class PaintApp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      color: '#000000',
      colorPickerOpen: false,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  };

  handleChangeComplete = color => {
    this.setState({
      color: color.hex,
      colorPickerOpen: false
    });
  };

  handleOpenPicker = () => {
    this.setState({ colorPickerOpen: true })
  };

  handleClosePicker = () => {
    this.setState({ colorPickerOpen: false });
  };

  handleResize = () => {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleResize, true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { paint, sketch, classes } = this.props;
    return (
      <div className={classes.canvasContainer}>
        <SketchCanvas
          styler={(ctx, shape) => {
            console.log(shape)
            if (shape.isSketch) {
              ctx.strokeStyle = this.state.color;
            }
            else {
              ctx.strokeStyle = shape.style;
            }
          }}
          width={this.state.screen.width}
          height={this.state.screen.height}
          paths={paint.paths}
          onSketch={path => sketch(path, this.state.color)} />
        <IconButton className={classes.settingsButton}
          onClick={() => this.props.paintTerminate()}
        >
          <Settings />
        </IconButton>
        <IconButton className={classes.undoButton}
          onClick={() => this.props.undo()}
        >
          <Undo />
        </IconButton>
        <IconButton className={classes.paletteButton}
          onClick={() => this.handleOpenPicker()}
        >
          <Palette />
        </IconButton>
        <IconButton className={classes.clearButton}
          onClick={() => this.props.clear()}
        >
          <Clear />
        </IconButton>
        <ColorPickerModal
          open={this.state.colorPickerOpen}
          color={this.state.color}
          onClose={this.handleClosePicker}
          onChangeComplete={this.handleChangeComplete}
        />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  console.log(state)
  return {
    paint: state.app.PAINT.store,
    lobby: state.lobby,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  sketch: (path, color) => dispatch(sketch(path, color)),
  undo: () => dispatch(undo()),
  clear: () => dispatch(clear()),
  paintTerminate: variant => dispatch(terminate(MANIFEST.NAME)),
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PaintApp)
);

