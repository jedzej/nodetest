import React from 'react';
import PropTypes from 'prop-types';

class MutatorIcon extends React.Component {
  static defaultProps = {
    interval: 200
  }

  constructor(props) {
    super(props);

    this.state = {
      current: props.icons[0]
    }
  }

  componentWillMount() {
    var index = 0;
    this.intHandle = setInterval(() => {
      this.setState({ current: this.props.icons[index] })
      index = (index + 1) % this.props.icons.length;
    }, this.props.interval);
  }

  componentWillUnmount() {
    if (this.intHandle) {
      clearInterval(this.intHandle);
      delete this.intHandle;
    }
  }

  render() {
    return <this.state.current {...this.props}/>
  }
}

MutatorIcon.propTypes = {
  icons: PropTypes.array.isRequired,
  interval: PropTypes.number.isRequired
};

export default MutatorIcon;