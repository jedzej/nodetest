import React from 'react';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = {
  card: {
    maxWidth: 350,
  },
  media: {
    height: 200,
  },
};


class PaintSelectorCard extends React.Component {

  render(){
    const { classes, user } = this.props;
        return (
      <div>
        <Card className={classes.card}>
          
          <CardContent>
            <Typography type="headline" component="h2">
              Paint APP
          </Typography>
            <Typography component="p">
              Paint if you can
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


export default withStyles(styles)(PaintSelectorCard)
