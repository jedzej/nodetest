import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Settings from 'material-ui-icons/Settings';
import Menu, { MenuItem } from 'material-ui/Menu';
import { connect } from "react-redux";
import { logout } from '../logic/user/actions';
import { leave } from '../logic/lobby/actions';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  handleLeaveLobby = () => {
    this.handleClose();
    this.props.leave();
  };

  handleLogout = () => {
    this.handleClose();
    this.props.logout();
  };

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
          <Toolbar className={classes.root}>
            <Typography type="title" color="inherit" className={classes.flex}>
              .nerdparty
            </Typography>
            {auth && (
              <div>
                {this.props.user.name}
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="contrast"
                >
                  <Settings />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  {this.props.user.loggedIn ?
                    <MenuItem onClick={this.handleLeaveLobby}>Leave lobby</MenuItem> : null
                  }
                  <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => {
  return {
    user: state.user,
    lobby: state.lobby,
  };
};
const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch(logout());
  },
  leave: () => {
    dispatch(leave())
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(MenuAppBar));

