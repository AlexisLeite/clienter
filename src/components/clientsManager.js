import React, { Component } from "react";
import { PropTypes } from "prop-types";
import ClientDetails from "./clientDetails";
import { Clients } from "./../services/data";
import ControlledChangeInput from "./controlledChangeInput";
import { easySuscriptions } from "./../common";

class ClientsManager extends Component {
  state = { clients: [] };

  componentDidMount() {
    easySuscriptions.call(this);
    if (this.props.mode === "picker" || this.props.mode === "manager") {
      this.makeSuscriptions(
        Clients.onUpdate((clients) => {
          this.setState({ clients, error: null });
        }),
        Clients.onError((error) => {
          this.setState({ error });
        })
      );
      Clients.repeatLastQuery();
    }
  }

  componentWillUnmount() {
    this.cancelSuscriptions();
  }

  doSearch(q = "") {
    Clients.get(q);
  }

  render() {
    const mode = this.props.mode ?? "normal";

    switch (mode) {
      case "widget":
        return <ClientDetails client={this.props.client} mode="widget" />;

      default:
        return this.state.clients === 0 ? (
          <div>No hay nada que mostrar</div>
        ) : (
          <>
            <div id="clients-list">
              <h3>Selecciona un cliente</h3>
              <form
                className="commands"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <ControlledChangeInput
                  type="text"
                  placeholder="Buscar"
                  onChange={(val) => {
                    this.doSearch(val);
                  }}
                  recover={Clients.currentQueryString}
                />
              </form>
              <div className="list">
                <div className="client-header">
                  <div>Nombre</div>
                  <div>Dirección</div>
                  <div>Teléfono</div>
                  <div>Barrio</div>
                </div>
                <div className="client-body">
                  {this.state.clients &&
                    this.state.clients.map((client) => (
                      <ClientDetails
                        key={client._id}
                        client={client}
                        mode={this.props.mode}
                        onSelect={() => {
                          this.props.onPick(client);
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
            <Clients.Navigation />
          </>
        );
    }
  }
}

ClientsManager.propTypes = {
  mode: PropTypes.oneOf(["picker", "widget", "normal"]),
  client: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    city: PropTypes.string,
    address: PropTypes.string,
  }),
  onPick: PropTypes.func,
};

export default ClientsManager;
