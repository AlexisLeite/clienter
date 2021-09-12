import React, { Component } from "react";
import { Orders } from "services/data";
import { easySuscriptions } from "./../common";
import { Error, exists } from "common";
import History from "./history";
import ClientsList from "./clientsList";

class NewOrder extends Component {
  state = {
    client: null,
    error: null,
  };

  componentDidMount() {
    easySuscriptions.call(this);
    this.makeSuscriptions(Orders.onError((error) => this.setState({ error })));
  }

  componentWillUnmount() {
    this.cancelSuscriptions();
  }

  render() {
    return this.state.client === null ? (
      <>
        <h1>Seleccione un cliente para continuar</h1>
        <ClientsList
          onPick={(client) => {
            this.setState({ client });
          }}
        />
      </>
    ) : (
      <>
        <form
          id="new-order"
          onSubmit={(ev) => {
            ev.preventDefault();

            const fields = ["equip", "diagnosis", "initialBudget", "symtoms"];
            const data = {};
            for (let field of fields) {
              data[field] = document.getElementById(field).value;
            }
            data.client = this.state.client.id ?? this.state.client._id;
            data.status = "Reparando";

            Orders.create(data).then((res) => {
              if (exists(res, "status") === "success") History.go(`/orders/${res.results[0]._id}`);
            });
          }}
        >
          <h2>Nueva orden de trabajo</h2>
          <Error message={this.state.error} />
          <ul>
            <li>
              <input type="text" value={this.state.client.name} readOnly={true} />
              <a
                href="/new"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ client: null });
                }}
              >
                x
              </a>
            </li>
            <li>
              <input id="equip" type="text" placeholder="Equipo" autoComplete="off" />
            </li>
            <li>
              <textarea id="symtoms" placeholder="Síntomas" />
            </li>
            <li>
              <textarea id="diagnosis" placeholder="Diagnóstico inicial" />
            </li>
            <li>
              <input
                id="initialBudget"
                type="text"
                placeholder="Presupuesto inicial"
                autoComplete="off"
              />
            </li>
            <li>
              <button type="submit">Ingresar</button>
            </li>
          </ul>
        </form>
      </>
    );
  }
}

export default NewOrder;
