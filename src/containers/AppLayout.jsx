import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import MenuIcon from 'material-ui-icons/Menu';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100vh',
  },
  appBarWithDrawer: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  appBar: {
    position: 'absolute'
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    height: '100vh',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 64px)',
      marginTop: '64px',
      width: drawerWidth,
      position: 'relative',
      zIndex: theme.zIndex.appBar - 1
    },
  },
  content: {
    backgroundColor: theme.palette.background.backgroundColor,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});

class AppLayout extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, theme } = this.props;
    var requiredKeys = ['top', 'drawer', 'main'];
    var nodes = {};

    React.Children.forEach(this.props.children, (child) => {
      if (child.key && requiredKeys.some((k) => k === child.key)) {
        requiredKeys = requiredKeys.filter((k) => k !== child.key);
        return nodes[child.key] = child;
      } else {
        throw new Error("Unacceptable key: " + child.key + ". Must be 'top','drawer' or 'main'");
      }
    });
    const hasDrawer = nodes['drawer'] !== undefined;

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              {hasDrawer ?
                <IconButton
                  color="contrast"
                  aria-label="open drawer"
                  onClick={this.handleDrawerToggle}
                  className={classes.navIconHide}
                >
                  <MenuIcon />
                </IconButton> : null
              }
              {nodes['top']}
            </Toolbar>
          </AppBar>
          {hasDrawer ?
            <Hidden mdUp>
              <Drawer
                type="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={this.state.mobileOpen}
                classes={{
                  paper: classes.drawerPaper,
                }}
                onClose={this.handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {nodes['drawer']}
              </Drawer>
            </Hidden> : null
          }
          {hasDrawer ?
            <Hidden smDown implementation="css">
              <Drawer
                type="permanent"
                open
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                {nodes['drawer']}
              </Drawer>
            </Hidden> : null
          }
          <main className={classes.content}>
            {nodes['main']}
          </main>
        </div>
      </div>
    );
  }
}

AppLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AppLayout);
