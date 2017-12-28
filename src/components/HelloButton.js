import React, { Component } from 'react';
import coreSapi from 'api/sapi/core'

class HelloButton extends Component {

  handleSubmit(event) {
    coreSapi.hello().then((response)=>{
      alert(response.event);
    })
    event.preventDefault();
  }

  render() {
    return (
      <button onClick={this.handleSubmit}>HELLO</button>
    );
  }
}

export default HelloButton;