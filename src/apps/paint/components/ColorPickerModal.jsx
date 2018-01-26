import React from 'react';
import { connect } from "react-redux";
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import SyncProblemIcon from 'material-ui-icons/SyncProblem';
import PropTypes from 'prop-types';
import { CirclePicker } from 'react-color';


const modalStyle = {
  position: 'absolute',
  width: '280px',
  top: `25%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
  border: '1px solid #e5e5e5',
  backgroundColor: '#fff',
  boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
  padding: 15,
  textAlign: 'center'
};

const colors = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#795548",
  "#607d8b",
  "#000000"
];

class ColorPickerModal extends React.Component {

  render() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        onClose={() => this.props.onClose()}
      >
        <div style={modalStyle}>
          <div style={{ paddingLeft: '24px' }}>
            <CirclePicker
              colors={colors}
              color={this.props.color}
              onChangeComplete={color => this.props.onChangeComplete(color)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}


ColorPickerModal.propTypes = {
  open: PropTypes.bool,
  onChangeComplete: PropTypes.func,
  onClose: PropTypes.func,
  color: PropTypes.object,
};

export default ColorPickerModal;