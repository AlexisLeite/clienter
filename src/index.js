import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route } from "react-router-dom";
import SplitView from "./components/splitview";

document.body.style.fontSize = "100%";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/(clients|orders|new)?">
        <SplitView />
      </Route>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
