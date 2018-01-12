import React from 'react';
import { connect } from "react-redux";
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import SyncProblemIcon from 'material-ui-icons/SyncProblem';
import { WEBSOCKET_OPENED } from '../webSocketMiddleware';


const modalStyle = {
  position: 'absolute',
  width: 8 * 50,
  top: `25%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
  border: '1px solid #e5e5e5',
  backgroundColor: '#fff',
  boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
  padding: 8 * 4,
  textAlign: 'center'
};


const iconStyle = {
  width: '50px',
  height: '50px',
  marginTop: '30px',
  marginBottom: 0,
}

class ConnectingModal extends React.Component {

  render() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.websocket !== WEBSOCKET_OPENED}
      >
        <div style={modalStyle}>
          <Typography type="title" id="modal-title">
            Attempting to connect...
            </Typography>
          <Typography type="subheading" id="simple-modal-description">
            <SyncProblemIcon className="fa-bounce" style={iconStyle} />
          </Typography>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    websocket: state.websocket,
  };
};

export default connect(mapStateToProps, null)(ConnectingModal);