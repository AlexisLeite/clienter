import React, { Component } from "react";
import Search from "services/search";
import { Link } from "react-router-dom";

class HomeOrders extends Component {
  render() {
    return (
      <div className="search-results">
        {Search.results &&
          Search.results.map((result) => (
            <Link to={`/order/${result.id}`} key={result.id}>
              <div className="search-result">
                <div className="order-data">
                  <strong>Cliente: </strong>
                  {result.client} <strong>Equipo: </strong>
                  {result.equip}
                </div>
                <div className="order-details">
                  <i>{result.brief}</i>
                  <strong>{new Date(result.date).toLocaleDateString()}</strong>
                </div>
              </div>
            </Link>
          ))}
      </div>
    );
  }
}

export default HomeOrders;
