import { EasyEvents } from "common";

class HistoryBuilder {
  constructor() {
    EasyEvents.call(this);
    window.addEventListener("popstate", this.parseLocationChange);
    this.addEvents(["locationChange"]);
  }

  go(relative) {
    if (window.location.pathname !== relative) {
      window.history.pushState({}, "", relative);
      dispatchEvent(new PopStateEvent("popstate"));
    }
  }

  parseLocationChange = () => {
    this.fireLocationChange(window.location.pathname);
  };
}

const History = new HistoryBuilder();
export default History;
