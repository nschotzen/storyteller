// App.js

import React from "react";
import "./App.css";
import CardsDeck from "./components/cardsDeck/CardsDeck";
import CardContainer from "./CardContainer";

function App() {
  return (
    <div className="App">
      <CardsDeck />
      {/* <CardContainer /> */}
    </div>
  );
}

export default App;
