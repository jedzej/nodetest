import React, { Component } from 'react';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button/Button';
import MergeType from 'material-ui-icons/MergeType';
import Typography from 'material-ui/Typography';


class LobbySelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: null,
    };
  }

  render() {
    const handleChange = panel => (event, expanded) => {
      this.setState({
        expanded: expanded ? panel : false,
      });
    };
    const { expanded } = this.state;

    return (
      <div>
        {this.props.lobbies.map(lobby =>
          <ExpansionPanel key={lobby.token} expanded={expanded === lobby.token} onChange={handleChange(lobby.token)} >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              {lobby.members.filter(m => m.id === lobby.leaderId)[0].name} ({lobby.members.length} members)
              </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container alignItems="center">
                <Grid xs={12} sm={6} item>
                  <Typography>Members</Typography>
                  <ul>
                    {(lobby.members.map(m =>
                      <li key={m.id}>{m.name}</li>))}
                  </ul>
                </Grid>
                <Grid xs={12} sm={6} item>
                  <Button raised color="primary" onClick={() => this.props.onJoin(lobby.token)}>JOIN <MergeType /></Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        , this)}
      </div>
    );
  }
}

export default LobbySelector;