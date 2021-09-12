import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import HomeOrders from "./homeOrders";
import { TiDelete } from "react-icons/ti";
import NewOrder from "./neworder";
import Orderdetails from "./orderDetails";
import History from "./history";
import { Orders } from "services/data";
import ControlledChangeInput from "./controlledChangeInput";
import { easySuscriptions, Error } from "./../common";
import { ServerLoader } from "services/serverComunication";
import { fixRootClass, unfixRootClass } from "index";
import ClientsList from "./clientsList";

class SplitView extends Component {
  state = {
    results: [],
  };
  errorsSuscription = null;
  searchRef = React.createRef();
  updatesSuscription = null;

  componentDidMount() {
    if (this.searchRef.current) this.searchRef.current.focus();
    easySuscriptions.call(this);
    this.makeSuscriptions(
      Orders.onUpdate((results) => {
        this.setState({ results, error: null });
      }),
      Orders.onError((error) => {
        this.setState({ error });
      }),
      History.onLocationChange((location) => {
        if (location === "/") this.doSearch();
      })
    );
    this.doSearch();
  }

  componentWillUnmount() {
    this.cancelSuscriptions();
  }

  doSearch(q = null) {
    if (this.state.results.length === 0 || q !== null) Orders.get(q);
    else Orders.repeatLastQuery();
    this.setState({ error: null });
  }

  render() {
    return (
      <>
        <div id="home-left-panel">
          <h1>
            <Link to="/">Clienter</Link>
          </h1>
          <div className="search">
            <Route exact path="/">
              <ControlledChangeInput
                type="text"
                placeholder="Buscar"
                reference={this.searchRef}
                onChange={(val) => {
                  this.doSearch(val);
                }}
                onBlur={(ev) => {
                  unfixRootClass();
                }}
                onFocus={(ev) => {
                  fixRootClass("elegant-fixed");
                }}
                recover={Orders.currentQueryString}
              />
              {this.searchRef.current && this.searchRef.current.value.length > 0 && (
                <button
                  onClick={() => {
                    this.searchRef.current.value = "";
                    this.searchRef.current.focus();
                    this.doSearch("");
                  }}
                  className="transparent"
                >
                  <TiDelete />
                </button>
              )}
            </Route>
          </div>
          <ServerLoader />
          <div id="home-links">
            <Link to="/clients">Clientes</Link>
            <Link to="/orders/new">Nueva orden</Link>
          </div>
        </div>
        <div id="home-right-panel">
          <Switch>
            <Route exact path="/">
              <Error message={this.state.error} />
              <HomeOrders
                results={this.state.results}
                onDelete={() => {
                  Orders.repeatLastQuery();
                }}
              />
            </Route>
            <Route exact path="/clients" component={ClientsList} />
            <Route exact path="/orders/new" component={NewOrder} />
            <Route exact path="/orders/:id" component={Orderdetails} />
          </Switch>
        </div>
      </>
    );
  }
}

export default SplitView;
