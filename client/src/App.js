import React, { Component } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Chat from "./Components/Chat";

import socket from "./Utils/socket";
import { Button } from "react-bootstrap";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      socket: null,
    };
  }

  async initConnection() {
    try {
      const res = await fetch("http://localhost:8888/username", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
      });

      const res_json = res.json();
      // Get value of user name cookie
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_name"))
        .split("=")[1];
      console.log(cookieValue);

      return cookieValue;
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.initConnection().then((cookie) => {
      this.setState({
        username: cookie,
        socket: socket(),
      });
    });
  }

  render() {
    return (
      <div className="App">
        {!this.state.username ? (
          <div className="no-connection">
            <h3>Cannot connect to the server :^(</h3>
            <Button>Retry</Button>
          </div>
        ) : (
          <React.Fragment>
            <Chat />
            <div className="online-user">
              <h4>Online users:</h4>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
