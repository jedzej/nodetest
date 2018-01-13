import React, { Component } from 'react';
import { connect } from "react-redux";
import { start } from '../apps/rsp/actions';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import appCardRSP from '../images/appcard-rsp.png';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
};

var AppSelectorCard = (props) => {
  const { classes } = props;
  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={appCardRSP}
        />
        <CardContent>
          <Typography type="headline" component="h2">
            {props.title}
          </Typography>
          <Typography component="p">
            {props.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button dense color="primary" onClick={props.onStart}>
            START
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

AppSelectorCard = withStyles(styles)(AppSelectorCard);




class AppSelector extends Component {

  render() {
    return (
      <AppSelectorCard
        onStart={this.props.rspStart}
        title="Rock-Scissors-Paper"
        description="Best game ever. If you lose, git gud." />
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  rspStart: (msg) => {
    dispatch(start(msg));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(AppSelector);
