import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import Search from "services/search";
import HomeOrders from "./homeorders";
import { TiDelete } from "react-icons/ti";
import NewOrder from "./neworder";

class SplitView extends Component {
  state = {
    results: null,
  };

  searchOrder = (q) => {
    this.setState({ query: q });
    Search.go(q);
  };

  searchRef = React.createRef();

  componentDidMount() {
    if (this.searchRef.current) this.searchRef.current.focus();
  }

  render() {
    return (
      <>
        <div id="home-left-panel">
          <h1>
            <Link to="/">IA Uruguay</Link>
          </h1>
          <div className="search">
            <Route exact path="/">
              <input
                type="text"
                placeholder="Buscar"
                ref={this.searchRef}
                value={Search.query}
                onChange={(ev) => this.searchOrder(ev.target.value)}
              />
              {Search.query !== "" && (
                <button
                  onClick={() => {
                    this.searchRef.current.value = "";
                    this.searchRef.current.focus();
                    this.searchOrder("");
                  }}
                  className="transparent"
                >
                  <TiDelete />
                </button>
              )}
            </Route>
          </div>
          <div id="home-links">
            <Link to="/clients">Clientes</Link>
            <Link to="/new">Nueva orden</Link>
          </div>
        </div>
        <div id="home-right-panel">
          <Route exact path="/">
            <HomeOrders q={Search.query} />
          </Route>
          <Route exact path="/new">
            <NewOrder />
          </Route>
        </div>
      </>
    );
  }
}

export default SplitView;
