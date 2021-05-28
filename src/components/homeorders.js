import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { Orders } from "services/data";

class HomeOrders extends Component {
  static defaultProps = {
    onDelete: () => {},
  };

  render() {
    return (
      <>
        <div className="search-results">
          <div className="items-list">
            {this.props.results &&
              this.props.results.map((result) => (
                <Link to={`/orders/${result._id}`} key={result._id}>
                  <div className="search-result">
                    <div className="order-data">
                      <div className="commands">
                        <button
                          className="icon"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            ev.preventDefault();
                            Orders.delete(result._id).then(this.props.onDelete);
                          }}
                        >
                          X
                        </button>
                      </div>
                      <strong>Cliente: </strong>
                      {result.client.name} <strong>Equipo: </strong>
                      {result.equip}
                    </div>
                    <div className="order-details">
                      <div>
                        <strong>Síntomas: </strong>
                      </div>
                      <i>{result.symtoms}</i>
                      <div>
                        <strong>Diagnóstico: </strong>
                      </div>
                      <i>{result.diagnosis}</i>
                      <strong className="date">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        <Orders.Navigation />
      </>
    );
  }
}

HomeOrders.propTypes = {
  results: PropTypes.array,
  onDelete: PropTypes.func,
};

export default HomeOrders;
