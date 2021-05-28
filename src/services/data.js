import { api, easySuscriptions, Error, ucFirst } from "common";
import { ServerCommunications } from "./serverComunication";
import { EasyEvents } from "./../common";
import { Component, React } from "react";
import { PropTypes } from "prop-types";
import {
  EditableContextMaker,
  EditableField,
  EditableFieldContext,
} from "components/editableField";

class DataSource {
  changed = false;
  currentPage = 0;
  currentQuery = "";
  currentQueryString = "";
  formatted = false;
  links = {};
  linksList = ["first", "prev", "next", "last"];
  requestPromise = null;
  results = [];
  totalResults = 0;

  constructor(name, options = {}) {
    this.name = name;
    this.configure(Object.assign({ perPage: 10, sort: {} }, options));

    EasyEvents.call(this);
    this.addEvents(["error", "update"]);
    this.onRegisterUpdate((cb) => cb(this.results));

    this.linksList.forEach((link) => {
      this[`get${ucFirst(link)}`] = function () {
        if (typeof this.links[link] === "string") {
          this.get(this.links[link], true);
        }
      };
      Object.defineProperty(this, `exists${ucFirst(link)}`, {
        get: () => typeof this.links[link] === "string",
      });
    });

    ServerCommunications.get(api(`/${this.name}s/getDetails`)).then((res) => {
      this.fields = res;
    });
  }

  configure(options = {}) {
    Object.assign(this, options);
  }

  create(data) {
    return this.fetch("post", `${this.name}s`, data);
  }

  delete(id) {
    if (window.confirm("Estás seguro que querés eliminar?"))
      return this.fetch("delete", `${this.name}s/${id}`);
    return { then: () => {} };
  }

  get(query = null, formatted = false) {
    this.currentQuery = query;
    this.formatted = formatted;

    if (!formatted) {
      this.currentQueryString = query;
      let queryObject = {
        perPage: this.perPage,
        sort: Object.entries(this.sort)
          .map((el) => {
            return el[1] === -1 ? `-${el[0]}` : el[0];
          })
          .join(","),
      };
      if (query !== null) queryObject.q = query;
      let queryString = Object.entries(queryObject)
        .map((key) => `${key[0]}=${key[1]}`)
        .join("&");

      query = `${this.name}s?${queryString}`;
    }

    const promise = this.fetch("get", query);
    promise.then((res) => {
      if (typeof res === "object" && res)
        if (res.status === "success") {
          this.linksList.forEach((el) => {
            if (res.statistics[el]) this.links[el] = res.statistics[el];
            else this.links[el] = null;
          });
          this.totalResults = res.statistics.total;
          this.fireUpdate(res.results);
          this.results = res.results;
        }
    });

    return { abort: promise.abort };
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      this.fetch("get", `${this.name}s/${id}`).then((res) => {
        if (res.status === "success") resolve(res.results[0]);
      });
    });
  }

  fetch(method, uri, data = {}, options = {}) {
    if (!["delete", "get", "patch", "post"].includes(method.toLowerCase()))
      throw new Error("The method is not valid");

    return ServerCommunications[method](api(uri), data, options)
      .catch((error) => {
        if (typeof error === "object" && error.status === "error") {
          this.fireError(`Server error: ${error.message}`);
        } else this.fireError(error);
      })
      .then((res) => {
        // Parse the results
        if (typeof res === "object" && res) {
          if (res.status === "error") {
            this.fireError(res.message);
          }
        }
        return res;
      });
  }

  Navigation = () => {
    return (
      <div className="navigation">
        <small>
          {this.totalResults} resultado{this.totalResults !== 1 && "s"}.
        </small>
        <button onClick={() => this.getFirst()} disabled={!this.existsFirst}>
          First
        </button>
        <button onClick={() => this.getPrev()} disabled={!this.existsPrev}>
          Prev
        </button>
        <button onClick={() => this.getNext()} disabled={!this.existsNext}>
          Next
        </button>
        <button onClick={() => this.getLast()} disabled={!this.existsLast}>
          Last
        </button>
      </div>
    );
  };

  repeatLastQuery() {
    this.get(this.currentQuery, this.formatted);
  }

  update(id, data) {
    return this.fetch("patch", `${this.name}s/${id}`, data);
  }
}

export class DataTable extends Component {
  static defaultProps = {
    className: null,
    id: null,
    q: "",
  };

  state = {
    results: [],
  };

  componentDidMount() {
    this.editableContext = EditableContextMaker.call(this);

    easySuscriptions.call(this);
    this.makeSuscriptions(
      this.props.source.onUpdate((results) => {
        results = results.map((result) => {
          result.editing = false;
          return result;
        });
        this.setState({ results, error: null });
      }),
      this.props.source.onError((error) => this.setState({ error }))
    );
    this.doSearch();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.q !== this.props.q) this.doSearch(this.props.q);
  }

  componentWillUnmount() {
    this.cancelSuscriptions();
  }

  doSearch(q = "") {
    this.props.source.get(this.props.q);
  }

  render() {
    const Navigation = this.props.source.Navigation;
    const fields = this.props.fields ?? this.props.source.fields;
    let fieldsMap = this.props.fieldsMap ?? {};
    let displayFields = {};
    fields.forEach((field) => {
      displayFields[field] = field in fieldsMap ? fieldsMap[field] : field;
    });

    if (fields) {
      const parameters = {};
      if (this.props.id) parameters.id = this.props.id;
      return [
        <Error message={this.state.error} key="Error" />,
        <EditableFieldContext.Provider value={this.editableContext} key="Provider">
          <table className={`data-source-table ${this.props.className ?? ""}`} {...parameters}>
            <thead>
              <tr>
                {fields.map((field) => (
                  <th key={field}>{fieldsMap[field]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.state.results.map((result, index) => {
                const cells = [];
                fields.forEach((field) => {
                  cells.push(
                    <td key={field}>
                      <EditableField
                        editing={result.editing}
                        key={`${result._id}_${field}`}
                        name={`${result._id}_${field}`}
                        onTypedCancel={() => {
                          const results = this.state.results;
                          results[index].editing = false;
                          this.setState({ results });
                        }}
                        onTypedConfirm={(id) => {
                          id = id.match(/([\w]+)_.*/)[1];
                          let update = {};
                          fields.forEach((field) => {
                            let value = this.state.fields[`${id}_${field}`];
                            if (value) update[field] = value;
                          });
                          if (Object.keys(update).length > 0) {
                            this.props.source.update(id, update).then((res) => {
                              if (res) {
                                this.props.source.repeatLastQuery();
                              }
                            });

                            const results = this.state.results;
                            results[index].editing = false;
                            this.setState({ results });
                          }
                        }}
                        value={result[field]}
                      />
                    </td>
                  );
                });
                return (
                  <tr
                    key={result._id}
                    onClick={() => {
                      this.props.onClick && this.props.onClick(result);
                    }}
                  >
                    {cells}
                    <td width="90px">
                      <button
                        className="icon"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          const results = this.state.results;
                          results[index].editing = true;
                          this.setState({ results });
                        }}
                      >
                        E
                      </button>
                      <button
                        className="icon"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          this.props.source.delete(result._id).then((res) => {
                            if (res) this.props.source.repeatLastQuery();
                          });
                        }}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </EditableFieldContext.Provider>,
        <Navigation key="Navigation" />,
      ];
    } else return "Nada para mostrar";
  }
}

DataTable.propTypes = {
  className: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.string),
  fieldsMap: PropTypes.objectOf(PropTypes.string),
  id: PropTypes.string,
  onClick: PropTypes.func,
  q: PropTypes.string,
  source: PropTypes.instanceOf(DataSource),
};

export const Clients = new DataSource("client", { perPage: 10, sort: { name: 1 } });
export const Orders = new DataSource("order", { perPage: 5 });
export const Updates = new DataSource("update");
