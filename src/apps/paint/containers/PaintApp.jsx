import React from 'react';
import { connect } from "react-redux";
import { terminate } from '../../../logic/app/actions';
import withStyles from 'material-ui/styles/withStyles';
import MANIFEST from '../manifest'
import Button from 'material-ui/Button/Button';
import SketchCanvas from '../components/SketchCanvas';
import { sketch } from '../actions';


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
  }
});


class PaintApp extends React.Component {

  render() {
    const { paint, sketch } = this.props;
    return (
      <div>
        Just paint
        <SketchCanvas paths={paint.paths} onSketch={sketch} />
        <Button onClick={() => this.props.paintTerminate()} >TERMINATE</Button>
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
  sketch: path => dispatch(sketch(path)),
  paintTerminate: variant => dispatch(terminate(MANIFEST.NAME)),
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PaintApp)
);

