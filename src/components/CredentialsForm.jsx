import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Card from 'material-ui/Card';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: '120px',
  },
  menu: {
    width: 200,
  },
});


class CredentialsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: ""
    };
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state.name, this.state.password);
    event.preventDefault();
  }

  render() {
    const { classes } = this.props;
    return (
      <form onSubmit={event => this.handleSubmit(event)}>
        <Grid container spacing={0} justify="center">
          <Grid xl={12}>
            {this.props.children}
          </Grid>
          <Grid item sm={6}>
            <TextField
              className={classes.textField}
              label="Name"
              margin="normal"
              type="text"
              name="name"
              value={this.state.name}
              onChange={event => this.handleChange(event)}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              className={classes.textField}
              label="Password"
              margin="normal"
              type="password"
              name="password"
              value={this.state.password}
              onChange={event => this.handleChange(event)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button raised type="submit" color="primary">{this.props.submitValue || 'submit'}</Button>
          </Grid>
        </Grid>
      </form>
    );

  }
}


export default withStyles(styles)(CredentialsForm);
