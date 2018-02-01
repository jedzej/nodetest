import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { configure } from '../../actions';

import MANIFEST from '../../manifest'
import Button from 'material-ui/Button/Button';
import Checkbox from 'material-ui/Checkbox';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import FormGroup from 'material-ui/Form/FormGroup';
import _ from 'lodash';
import Grid from 'material-ui/Grid/Grid';

const { CHAR, TEAM } = MANIFEST.CONSTS;

const styles = theme => {
  console.log(theme); return ({
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
    undoButtonDisabled: {
      position: 'absolute',
      color: '#CCC',
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
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#fff'
    }
  })
};

class SpecialCharactersSelector extends React.Component {

  handleCheckboxChange = char => event => {
    let config = _.cloneDeep(this.props.avaclone.localConfiguration);
    config.specialChars[char] = event.target.checked;
    this.props.configure(config);
  }

  render() {
    const localConfig = this.props.avaclone.localConfiguration;
    const specialChars = Object.keys(localConfig.specialChars);

    const charCheckbox = char => (
      <FormControlLabel
        key={char}
        control={
          <Checkbox
            checked={localConfig.specialChars[char]}
            onChange={this.handleCheckboxChange(char)}
            value={char}
          />
        }
        label={char}
      />
    );

    return (
      <Grid container>
        <Grid item>
          <FormGroup>
            {specialChars
              .filter(char => TEAM.EVIL.includes(char))
              .map(charCheckbox)}
          </FormGroup>
        </Grid>
        <Grid item>
          <FormGroup>
            {specialChars
              .filter(char => TEAM.GOOD.includes(char))
              .map(charCheckbox)}
          </FormGroup>
        </Grid>
      </Grid>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
  };
};

const mapDispatchToProps = (dispatch) => ({
  configure: configuration => dispatch(configure(configuration))
})



export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(SpecialCharactersSelector)
);
