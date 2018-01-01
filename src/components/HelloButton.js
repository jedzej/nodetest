import React, { Component } from 'react';
import { connect } from "react-redux";

class HelloButton extends Component {
  render() {
    return (
      <button onClick={this.props.sayHello}>HELLO</button>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hello: state.hello,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sayHello: () => {
      dispatch({
        type: "HELLO"
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HelloButton);