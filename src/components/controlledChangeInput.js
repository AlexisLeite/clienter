import React, { Component } from "react";
import { PropTypes } from "prop-types";

class ControlledChangeInput extends Component {
  static defaultProps = {
    className: "",
    id: "",
    onChange: () => {},
    placeholder: "",
    recover: "",
    reference: React.createRef(),
  };

  changed = false;
  interval = null;
  isset = false;
  lastUpdate = Date.now();
  timing = 400;
  value = null;

  componentDidMount() {
    setInterval(() => {
      if (this.changed && Date.now() - this.lastUpdate > this.timing) {
        this.changed = false;
        this.props.onChange(this.value);
      }
    }, this.timing);
    this.props.reference.current.value = this.props.recover;
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  pushChange = (val) => {
    this.lastUpdate = Date.now();
    this.changed = true;
    this.value = val;
  };

  render() {
    return (
      <input
        type="text"
        id={this.props.id}
        className={this.props.className}
        onChange={(ev) => {
          this.pushChange(ev.target.value);
        }}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        placeholder={this.props.placeholder}
        ref={this.props.reference}
        autoComplete="off"
      />
    );
  }
}

ControlledChangeInput.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  recover: PropTypes.string,
};

export default ControlledChangeInput;
