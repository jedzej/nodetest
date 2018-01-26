import React from 'react';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import appCardRSP from '../images/appcard-rsp.png';


const styles = {
  card: {
    maxWidth: 350,
  },
  media: {
    height: 200,
  },
};


class RspSelectorCard extends React.Component {

  render() {
    const { classes, user } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={appCardRSP}
          />
          <CardContent>
            <Typography type="headline" component="h2">
              Rock-Scissors-Paper
          </Typography>
            <Typography component="p">
              Best game ever. If you lose, git gud. Thats all
          </Typography>
          </CardContent>
          <CardActions>
            <Button dense color="primary"
              disabled={user.isLeader === false}
              onClick={this.props.onStart}>
              START
          </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}


export default withStyles(styles)(RspSelectorCard)
