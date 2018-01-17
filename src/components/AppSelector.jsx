import React, { Component } from 'react';
import { connect } from "react-redux";
import { start } from '../logic/app/actions';
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
          <Button disabled={props.disabled} dense color="primary" onClick={props.onStart}>
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
        onStart={()=>this.props.rspStart('rsp')}
        title="Rock-Scissors-Paper"
        description="Best game ever. If you lose, git gud."
        disabled={this.props.user._id !== this.props.lobby.leaderId} />
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
  rspStart: (name) => {
    dispatch(start(name));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(AppSelector);
