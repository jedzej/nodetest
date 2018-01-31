import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { terminate } from '../../../logic/app/actions';
import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { configure } from '../actions';

import MANIFEST from '../manifest'
import Button from 'material-ui/Button/Button';
import Checkbox from 'material-ui/Checkbox';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import FormGroup from 'material-ui/Form/FormGroup';
import _ from 'lodash';

const { CHAR } = MANIFEST.CONSTS;

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


class ConfigurationSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      configuration: _.cloneDeep(this.props.avaclone.store.configuration)
    };
  };

  handleCheckboxChange = (char) => {
    console.log(char)
  }

  handleConfigure = () => {
    this.props.configure({});
  }


  render() {
    const { avaclone } = this.props;
    const configuration = this.state.configuration;
    console.log(configuration)
    const specialCharacters = Object.values(CHAR).filter(
      char => (char !== CHAR.GOOD && char !== CHAR.EVIL)
    );
    const config = avaclone.configurationPending ?
      this.state.configuration : avaclone.store.configuration

    return (
      <FormGroup row>
        {specialCharacters.map(char => (
          <FormControlLabel
            key={char}
            control={
              <Checkbox
                checked={configuration.specialChars.includes(char)}
                //onChange={this.handleCheckboxChange}
                value={char}
              />
            }
            label={char}
          />
        ))}
        <Button onClick={this.handleConfigure}>configure</Button>
      </FormGroup>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    localConfiguration: state.avaclone.localConfiguration,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  configure: configuration => dispatch(configure(configuration)),
  terminate: variant => dispatch(terminate(MANIFEST.NAME)),
  logout: () => {
    dispatch(logout());
  },
  leave: () => {
    dispatch(leave())
  }
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ConfigurationSection)
);
