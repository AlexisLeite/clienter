import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class ClientDetails extends Component {
  render() {
    const classAdd = this.props.mode ?? "normal";
    return (
      <div
        className={`client-details ${classAdd}`}
        onClick={() => {
          if (this.props.mode === "picker") {
            this.props.onSelect();
          }
        }}
      >
        {this.props.mode === "widget" && (
          <h3>
            Client:
            <Link
              to={`/clients/${this.props.client.id ?? this.props.client._id}`}
              dangerouslySetInnerHTML={{ __html: "&nearr;" }}
            ></Link>
          </h3>
        )}
        <div>
          <strong>Nombre: </strong>
          <span>{this.props.client.name}</span>
        </div>
        <div>
          <strong>Dirección: </strong>
          <span>{this.props.client.address}</span>
        </div>
        <div>
          <strong>Teléfono: </strong>
          <span>{this.props.client.phone}</span>
        </div>
        <div>
          <strong>Barrio: </strong>
          <span>{this.props.client.city}</span>
        </div>
      </div>
    );
  }
}

ClientDetails.propTypes = {
  client: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
    city: PropTypes.string,
  }).isRequired,
  mode: PropTypes.oneOf(["widget", "picker", "normal"]),
  onSelect: PropTypes.func,
};

export default ClientDetails;
