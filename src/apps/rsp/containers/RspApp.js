import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Menu, { MenuItem } from 'material-ui/Menu';
import { connect } from "react-redux";
import { move } from '../actions';
import Button from 'material-ui/Button/Button';


class RspApp extends React.Component {
  render() {
    return <div>
      <Button onClick={()=>this.props.rspMove('rock')}>ROCK</Button><br/>
      <Button onClick={()=>this.props.rspMove('paper')}>PAPER</Button><br/>
      <Button onClick={()=>this.props.rspMove('scissors')}>SCISSORS</Button><br/><br/>

      {JSON.stringify(this.props.rsp.player1.moves)} vs

      {JSON.stringify(this.props.rsp.player2.moves)}<br/>
      </div>
  }
}

const mapStateToProps = (state) => {
  return {
    rsp: state.rsp,
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  rspMove: (variant) => {
    dispatch(move(variant));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(RspApp);

