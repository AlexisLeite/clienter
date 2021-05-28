import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import SplitView from "./components/splitView";

document.body.style.fontSize = "100%";
var lastMove = Date.now();
var fixed = false;

function resetUpdate() {
  lastMove = Date.now();
  setRootClass("");
}

export function fixRootClass(className) {
  setRootClass(className);
  fixed = true;
}

function setRootClass(className) {
  if (!fixed) document.getElementById("root").className = className;
}

export function unfixRootClass() {
  fixed = false;
}

const timing = 4000;

setInterval(() => {
  if (Date.now() - lastMove > (timing * 5) / 6) setRootClass("elegant");
}, timing);

window.addEventListener("mousemove", resetUpdate);
window.addEventListener("keydown", resetUpdate);

function App() {
  return (
    <>
      <BrowserRouter>
        <SplitView />
      </BrowserRouter>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
