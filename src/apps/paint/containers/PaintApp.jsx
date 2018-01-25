import React from 'react';
import { connect } from "react-redux";
import { terminate } from '../../../logic/app/actions';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography/Typography';
import MANIFEST from '../manifest'
import Button from 'material-ui/Button/Button';

const RESULT = MANIFEST.CONSTS.RESULT;

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
    return (
      <div>
        Just paint
      <Button onClick={() => this.props.paintTerminate()} />
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
  paintTerminate: (variant) => dispatch(terminate(MANIFEST.NAME)),
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PaintApp)
);

