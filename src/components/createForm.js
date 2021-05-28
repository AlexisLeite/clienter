import React, { Component } from "react";
import Modal from "./common/modal";
import { PropTypes } from "prop-types";
import { Error } from "common";

class CreateForm extends Component {
  render() {
    return (
      <Modal
        title={this.props.title}
        onClose={() => {
          this.props.onClose && this.props.onClose();
        }}
      >
        <form
          className="create-new"
          onSubmit={(ev) => {
            ev.preventDefault();
            let data = {};
            Object.keys(this.props.fields).map((field) => {
              data[field] = ev.target.querySelector(`[name='${field}']`).value;
            });
            this.props.onSave(data);
          }}
        >
          <Error message={this.props.error} />
          {Object.keys(this.props.fields).map((field) => {
            const value = this.props.fields[field];
            if (typeof value === "string")
              return (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={value}
                  autoComplete="off"
                />
              );
            else {
              if (typeof value.name !== "string")
                throw new Error("The passed name must be a string");
              const Type = value.tag;
              value.placeholder = value.placeholder ?? value.name;
              delete value.tag;
              return <Type {...value} key={field} autoComplete="off" />;
            }
          })}
          <button>Agregar</button>
        </form>
      </Modal>
    );
  }
}

CreateForm.propTypes = {
  error: PropTypes.string,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  fields: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.objectOf(PropTypes.string),
  ]).isRequired,
  title: PropTypes.string,
};

export default CreateForm;
