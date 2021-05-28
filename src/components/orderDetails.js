import React, { Component } from "react";
import { Orders, Updates } from "./../services/data";
import { easySuscriptions, Error } from "./../common";
import Modal from "./common/modal";
import History from "./history";

class Orderdetails extends Component {
  state = {
    editing: false,
    editedOrder: {},
  };

  componentDidMount() {
    easySuscriptions.call(this);
    this.makeSuscriptions(
      Orders.onError((error) => this.setState(error)),
      Updates.onError((error) => {
        this.setState({ error });
      })
    );
    this.update();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.editing === false && this.state.editing === true) {
      const input = document.getElementById("order-details").querySelector("input, textarea");
      if (input) input.focus();
    }
  }

  componentWillUnmount() {
    this.cancelSuscriptions();
  }

  FieldEdit = (props) => {
    if (this.state.editing && props.editable !== false) {
      const Kind = props.kind ?? "input";

      return (
        <Kind
          type="text"
          value={this.state.editedOrder[props.field] ?? ""}
          onKeyDown={(ev) => {
            if (ev.key === "Escape") {
              this.cancelEditing();
            }
            if (ev.key === "Enter") {
              this.saveEditing();
            }
          }}
          onChange={(ev) => {
            this.setState({
              editedOrder: { ...this.state.editedOrder, [props.field]: ev.target.value },
            });
          }}
        />
      );
    } else {
      return this.state.order[props.field];
    }
  };

  update() {
    Orders.getById(this.props.match.params.id).then((order) => {
      order.updates = order.updates.reverse();
      this.setState({ editedOrder: { ...order }, order, error: null, editing: false });
    });
  }

  cancelEditing = () => {
    this.setState({
      editing: false,
      editedOrder: { ...this.state.order },
    });
  };

  saveEditing = () => {
    Orders.update(this.state.order._id, this.state.editedOrder).then((res) => {
      if (res) this.update();
    });
  };

  startEditing = () => {
    this.setState({
      editing: true,
    });
  };

  render() {
    const order = this.state.order;
    const FieldEdit = this.FieldEdit;
    return order ? (
      <>
        <div id="order-details">
          {this.state.showAddUpdate && (
            <Modal
              title="Nueva actualización de trabajo"
              onClose={() => {
                this.setState({ showAddUpdate: false });
              }}
            >
              <form
                className="create-new"
                onSubmit={(ev) => {
                  ev.preventDefault();
                  const title = ev.target.querySelector('[name="title"]').value;
                  const description = ev.target.querySelector('[name="description"]').value;
                  const budget = ev.target.querySelector('[name="budget"]').value;

                  Updates.create({
                    order: order._id,
                    title,
                    description,
                    budget,
                  }).then((res) => {
                    if (res) {
                      this.setState({ showAddUpdate: false });
                      this.update();
                    }
                  });
                }}
              >
                <Error message={this.state.error} />
                <input name="title" type="text" placeholder="Titulo" />
                <textarea name="description" placeholder="Descripción"></textarea>
                <input name="budget" type="text" placeholder="Precio" />
                <button>Agregar</button>
              </form>
            </Modal>
          )}
          <Error message={this.state.error} />
          <table>
            <thead
              onClick={(ev) => {
                ev.target.className = "hide-body";
                console.log(ev);
                for (let el of ev.nativeEvent.path)
                  if (el.tagName === "THEAD") {
                    if (el.className === "") el.className = "hide-body";
                    else el.className = "";
                  }
              }}
            >
              <tr>
                <th colSpan="2">Cliente</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Nombre</th>
                <td>{order.client.name}</td>
              </tr>
              <tr>
                <th>Teléfono</th>
                <td>{order.client.phone}</td>
              </tr>
              <tr>
                <th>Dirección</th>
                <td>{order.client.address}</td>
              </tr>
              <tr>
                <th>Barrio</th>
                <td>{order.client.city}</td>
              </tr>
            </tbody>
            <thead
              onClick={(ev) => {
                ev.target.className = "hide-body";
                console.log(ev);
                for (let el of ev.nativeEvent.path)
                  if (el.tagName === "THEAD") {
                    if (el.className === "") el.className = "hide-body";
                    else el.className = "";
                  }
              }}
            >
              <tr>
                <th colSpan="2">Órden</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Fecha</th>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>Equipo</th>
                <td>
                  <FieldEdit field="equip" />
                </td>
              </tr>
              <tr>
                <th>Síntomas</th>
                <td>
                  <FieldEdit kind="textarea" field="symtoms" />
                </td>
              </tr>
              <tr>
                <th>Diagnóstico</th>
                <td>
                  <FieldEdit kind="textarea" field="diagnosis" />
                </td>
              </tr>
              <tr>
                <th>Estado</th>
                <td>
                  <FieldEdit field="status" editable={false} />
                </td>
              </tr>
              <tr>
                <th>Presupuesto inicial</th>
                <td>
                  <FieldEdit field="initialBudget" />
                </td>
              </tr>
              <tr>
                <th>Presupuesto final</th>
                <td className="number">{order.totalBudget}</td>
              </tr>
            </tbody>
            {order.updates.length > 0 && (
              <>
                <thead
                  onClick={(ev) => {
                    ev.target.className = "hide-body";
                    console.log(ev);
                    for (let el of ev.nativeEvent.path)
                      if (el.tagName === "THEAD") {
                        if (el.className === "") el.className = "hide-body";
                        else el.className = "";
                      }
                  }}
                >
                  <tr>
                    <th colSpan="2">Actualizaciones</th>
                  </tr>
                </thead>
                <tbody className="updates">
                  <tr>
                    <td colSpan="2">
                      {order.updates.map((update) => (
                        <table key={update._id}>
                          <thead
                            className="hide-body"
                            onClick={(ev) => {
                              ev.target.className = "hide-body";
                              console.log(ev);
                              for (let el of ev.nativeEvent.path)
                                if (el.tagName === "THEAD") {
                                  if (el.className === "") el.className = "hide-body";
                                  else el.className = "";
                                }
                            }}
                          >
                            <tr>
                              <td width="1px">
                                <button
                                  className="icon"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    Updates.delete(update._id).then(() => this.update());
                                  }}
                                >
                                  X
                                </button>
                              </td>
                              <td>{update.title}</td>
                              <th>Fecha</th>
                              <td width="100px">
                                {new Date(update.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan="2">{update.description}</td>
                              <th>Costo:</th>
                              <td>{update.budget}</td>
                            </tr>
                          </tbody>
                        </table>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </>
            )}
          </table>
        </div>

        <div className="navigation">
          {this.state.editing ? (
            <>
              <button className="cancel" onClick={this.cancelEditing}>
                Cancelar
              </button>
              <button onClick={this.saveEditing}>Guardar</button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  this.setState({ showAddUpdate: true });
                }}
              >
                Agregar actualización
              </button>
              <button
                onClick={() => {
                  Orders.delete(order._id).then((res) => {
                    if (res) History.go("/");
                  });
                }}
              >
                Eliminar
              </button>
              <button onClick={this.startEditing}>Editar</button>
            </>
          )}
        </div>
      </>
    ) : (
      "Nada para mostrar"
    );
  }
}

export default Orderdetails;
