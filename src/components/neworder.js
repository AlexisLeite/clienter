import React, { Component } from "react";

class NewOrder extends Component {
  render() {
    return (
      <>
        <form id="new-order">
          <h2>Nueva orden de trabajo</h2>
          <ul>
            <li>
              <input type="text" placeholder="Cliente" />
            </li>
            <li>
              <input type="text" placeholder="Equipo" />
            </li>
            <li>
              <textarea placeholder="Síntomas" />
            </li>
            <li>
              <input type="text" placeholder="Presupuesto inicial" />
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
