const clients = [
  {
    name: "Pepe",
    phone: "095421753",
  },
  {
    name: "Alexis",
    phone: "099105304",
  },
  {
    name: "Pipi",
    phone: "094799001",
  },
  {
    name: "Alito",
    phone: "092175148",
  },
  {
    name: "Pablo",
    phone: "092145786",
  },
];

const orders = [
  {
    id: 1,
    client: "Pepe",
    brief:
      "Notebook no enciende, la estaba prendiendo y explotó todo. Notebook no enciende, la estaba prendiendo y explotó todo. Notebook no enciende, la estaba prendiendo y explotó todo",
    date: Date.now() - 24 * 60 * 60 * 1000 * 6,
    equip: "Notebook Sony 14''",
  },
  {
    id: 2,
    client: "Alexis",
    brief: "Windows muy lento",
    date: Date.now() - 24 * 60 * 60 * 1000 * 3,
    equip: "Notebook Acer 17''",
  },
  {
    id: 3,
    client: "Pablo",
    brief: "Windows muy lento",
    date: Date.now() - 24 * 60 * 60 * 1000 * 3,
    equip: "Notebook Acer 17''",
  },
  {
    id: 4,
    client: "Pipi",
    brief: "Windows muy lento",
    date: Date.now() - 24 * 60 * 60 * 1000 * 3,
    equip: "Notebook Acer 17''",
  },
  {
    id: 5,
    client: "Alito",
    brief: "Windows muy lento",
    date: Date.now() - 24 * 60 * 60 * 1000 * 3,
    equip: "Notebook Acer 17''",
  },
  {
    id: 6,
    client: "Alexis",
    brief: "Windows muy lento",
    date: Date.now() - 24 * 60 * 60 * 1000 * 3,
    equip: "Notebook Acer 17''",
  },
  {
    id: 7,
    client: "Pablo",
    brief: "Windows muy lento",
    date: Date.now() - 24 * 60 * 60 * 1000 * 3,
    equip: "Notebook Acer 17''",
  },
];

export default class Clients {
  static all() {
    return clients;
  }

  static orders(q = "") {
    if (q === "") return orders;
    return orders.filter((el) => {
      let search = ["client", "brief", "equip"];
      for (let prop of search) {
        if (el[prop].indexOf(q) !== -1) return true;
      }
      return false;
    });
  }
}
