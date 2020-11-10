import React, { Component } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Chat from "./Components/Chat";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      socket: null,
    };
  }

  componentDidMount() {
    // fetch
    fetch("/username", {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then((res) => {
      console.log(res);
    });
  }

  render() {
    return (
      <div className="App">
        <Chat />
        <div className="online-user">
          <h4>Online users:</h4>
        </div>
      </div>
    );
  }
}
