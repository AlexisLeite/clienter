import React, { Component } from "react";
import { PropTypes } from "prop-types";

export const EditableFieldContext = React.createContext();
export const EditableContextMaker = function () {
  this.setState({ fields: {} });
  return {
    set: (field, value) => {
      this.setState({ fields: { ...this.state.fields, [field]: value } });
    },
  };
};

export class EditableField extends Component {
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.editing === false && this.props.editing === true) {
      if (this.fieldRef.current) {
        this.fieldRef.current.value = this.props.value ?? "";
        this.fieldRef.current.focus();
      }
    }
  }

  fieldRef = React.createRef();

  render() {
    const Kind = this.props.kind ?? "input";
    const properties = {};
    this.props.type
      ? (properties.type = this.props.type)
      : Kind === "input" && (properties.type = "text");

    if (this.props.editing && this.props.editable !== false) {
      const Kind = this.props.kind ?? "input";

      return (
        <EditableFieldContext.Consumer>
          {(context) => (
            <Kind
              {...properties}
              ref={this.fieldRef}
              onClick={(ev) => ev.stopPropagation()}
              onKeyDown={(ev) => {
                if (ev.key === "Escape") {
                  this.props.onTypedCancel && this.props.onTypedCancel();
                }
                if (ev.key === "Enter") {
                  this.props.onTypedConfirm && this.props.onTypedConfirm(this.props.name);
                }
              }}
              onChange={(ev) => {
                context.set(this.props.name, ev.target.value);
              }}
            />
          )}
        </EditableFieldContext.Consumer>
      );
    } else {
      return this.props.value;
    }
  }
}

EditableField.propTypes = {
  editable: PropTypes.bool,
  editing: PropTypes.bool,
  kind: PropTypes.string,
  name: PropTypes.string.isRequired,
  onTypedCancel: PropTypes.func,
  onTypedConfirm: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
};
