import React, { Component } from "react";
import { Clients, DataTable } from "services/data";
import ControlledChangeInput from "./controlledChangeInput";
import { PropTypes } from "prop-types";
import CreateForm from "./createForm";
import { easySuscriptions, Error } from "common";

class ClientsList extends Component {
  state = {
    adding: false,
    q: "",
  };

  componentDidMount() {
    easySuscriptions.call(this);
    this.makeSuscriptions(Clients.onError((error) => this.setState({ error })));
  }

  componentWillUnmount() {
    this.cancelSuscriptions();
  }

  render() {
    return (
      <div id="clients-list">
        <div>
          {this.state.adding && (
            <CreateForm
              error={this.state.error}
              fields={{
                name: "Nombre",
                phone: "Teléfono",
                address: "Dirección",
                city: "Barrio",
              }}
              onClose={() => {
                this.setState({ adding: false });
              }}
              onSave={(data) => {
                Clients.create(data).then((res) => {
                  if (res) {
                    Clients.repeatLastQuery();
                    this.setState({ adding: false });
                    this.props.onPick && this.props.onPick(res.results[0]);
                  }
                });
              }}
              title="Agregar nuevo cliente"
            />
          )}
          <div className="commands">
            <ControlledChangeInput
              onChange={(q) => {
                this.setState({ q });
              }}
              placeholder="Buscar"
            />
            <button
              onClick={() => {
                this.setState({ adding: true });
              }}
            >
              Agregar
            </button>
          </div>

          <DataTable
            className="clients-list"
            fields={["name", "phone", "address", "city"]}
            fieldsMap={{ name: "Nombre", phone: "Teléfono", address: "Dirección", city: "Barrio" }}
            onClick={(client) => this.props.onPick && this.props.onPick(client)}
            q={this.state.q}
            source={Clients}
          />
        </div>
      </div>
    );
  }
}

ClientsList.propTypes = {
  onPick: PropTypes.func,
};

export default ClientsList;
