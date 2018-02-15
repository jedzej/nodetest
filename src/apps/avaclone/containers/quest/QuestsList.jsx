import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableRow, TableCell } from 'material-ui/Table';

import QuestInfo from './QuestInfo';
import QuestIcon from './QuestIcon';


const styles = theme => ({
  actionCell: {
    textAlign: 'right'
  },
  iconCell: {
    textAlign: 'right',
    padding: theme.spacing.unit,
    width: '25px'
  }
});

class QuestsList extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const { actions, classes } = this.props;
    return (
      <Table>
        <TableBody>
          {Object.values(store.quests).map(quest => (
            <TableRow key={quest.number}>
              <TableCell className={classes.iconCell} padding="none">
                <QuestIcon stage={quest.stage} />
              </TableCell>
              <TableCell padding="none">
                <QuestInfo questNumber={quest.number} />
              </TableCell>
              <TableCell className={classes.actionCell} padding="none">
                {actions && actions.map(action => action(quest))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

QuestsList.propTypes = {
  classes: PropTypes.object,
};

const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  lobby: state.lobby
});


export default withStyles(styles)(
  connect(mapStateToProps, null)(QuestsList)
);
