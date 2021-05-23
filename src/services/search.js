import Clients from "./clients";

export default class Search {
  static results = [];
  static query = "";

  static go = (q = "") => {
    Search.results = Clients.orders(q);
    Search.query = q;
    return Search.results;
  };
}

Search.go();
