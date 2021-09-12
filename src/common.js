export function api(route) {
  if (route.charAt(0) === "/") route = route.substring(1);
  return `${env("api")}/${route}`;
}
export function server(route) {
  return `/${route}`;
}

// Usage: className(ifOneClass,"oneClass",ifSecondClass,"secondClass"...)
export function className(...args) {
  if (args.length % 2 !== 0) args = args.slice(0, args.length - 1);
  let classes = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i]) classes.push(args[++i]);
  }
  return { className: classes.join(" ") };
}

export function consoleAccess(name, obj) {
  window[name] = obj;
}

export function env(sufix) {
  return process.env[`REACT_APP_${sufix}`];
}

export function exists(obj, route, cb) {
  route = route.split(".");
  for (let dir of route) {
    if (!(typeof obj === "object" || typeof obj === "function") || obj === null || !(dir in obj))
      return false;
    obj = obj[dir];
  }

  if (typeof cb === "function") cb(obj);
  return obj;
}

export function EasyEvents() {
  const self = this;

  self.easyEventsId = 0;
  self.easyEvents = [];

  self.addEvent = function (name) {
    name = ucFirst(name);
    self.easyEvents.push(name);
    self[`on${name}Callbacks`] = [];
    self[`onRegister${name}Callbacks`] = [];
    self[`off${name}`] = function (suscription) {
      if (exists(self, `on${name}Callbacks`))
        self[`on${name}Callbacks`] = self[`on${name}Callbacks`].filter(
          (record) => record.callback !== suscription.callback || record.id !== suscription.id
        );
    };
    self[`on${name}`] = function (callback) {
      if (typeof callback == "function") {
        let id = self.easyEventsId++;
        self[`on${name}Callbacks`].push({ callback: callback, id });

        for (let onRegisterCb of self[`onRegister${name}Callbacks`]) {
          onRegisterCb.callback(callback);
        }

        return {
          callback,
          id,
          cancel: () => {
            self[`off${name}`]({ callback, id });
          },
        };
      }
    };
    self[`onRegister${name}`] = function (cb) {
      if (typeof cb == "function") {
        let newId = self.easyEventsId++;
        self[`onRegister${name}Callbacks`].push({ callback: cb, id: newId });
        return newId;
      }
    };

    self[`fire${name}`] = function (...args) {
      for (let record of self[`on${name}Callbacks`]) record.callback(...args);
    };
  };

  self.addEvents = function (events) {
    for (let event of events) {
      self.addEvent(event);
    }
  };

  self.off = function (event, suscription) {
    if (`off${ucFirst(event)}` in self) return self[`off${ucFirst(event)}`]();
  };

  self.on = function (event, handler) {
    if (!(`on${ucFirst(event)}` in self)) {
      self.addEvent(event);
    }
    return self[`on${ucFirst(event)}`](handler);
  };
}

export function Error(params) {
  return params.message ? (
    <div className={`error ${params.className ?? ""}`}>{params.message}</div>
  ) : (
    ""
  );
}

export function hashes(ammount) {
  var array = new Uint32Array(ammount);
  return window.crypto.getRandomValues(array);
}

export function easySuscriptions() {
  const self = this;

  self.suscriptions = [];
  self.makeSuscriptions = function (...suscriptions) {
    for (let suscription of suscriptions) self.suscriptions.push(suscription);
  };
  self.cancelSuscriptions = () => {
    for (let suscription of self.suscriptions) exists(suscription, "cancel", (cancel) => cancel());
  };
}

export function max(...args) {
  let current = -Infinity;
  for (let arg of args) if (arg > current) current = arg;
  return current;
}

export function required(name) {
  throw Error(`The parameter ${name} is required`);
}

export function round(val, digits) {
  return Math.round(val * 10 ** digits) / 10 ** digits;
}

export function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}
