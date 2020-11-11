import React, { Component } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import socket from "./Utils/socket";
import { Button } from "react-bootstrap";
import Chat from "./Components/Chat";
import OnlineUsers from "./Components/OnlineUsers";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.server_socket = socket();
    this.state = {
      connected: false,
      id: null,
    };

    this.onRetry = this.onRetry.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
  }

  async getUserID() {
    try {
      const res = await fetch("http://localhost:8888/id", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
      });

      const res_json = await res.json();

      // Get value of user name cookie
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_id"))
        .split("=")[1];
      console.log("getUserID: ", cookieValue);

      return cookieValue;
    } catch (error) {
      throw error;
    }
  }

  onRetry() {
    this.getUserID()
      .then((id) => {
        this.server_socket.joinRoomID(id);

        // Register to some event handlers

        this.setState({
          id: id,
          connected: true,
        });
      })
      .catch((err) => console.log(err));
  }

  onDisconnect() {
    // Unregister to event handlers
    this.setState({
      connected: false,
    });
  }

  componentDidMount() {
    this.getUserID()
      .then((id) => {
        this.server_socket.joinRoomID(id);

        // Register to some event handlers
        this.server_socket.registerDisconnect(this.onDisconnect);

        this.setState({
          id: id,
          connected: true,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="App">
        {!this.state.id ? (
          <div className="no-connection">
            <h3>Cannot connect to the server :^(</h3>
            <Button onClick={this.onRetry}>Retry</Button>
          </div>
        ) : (
          <React.Fragment>
            <Chat
              userName={this.state.username}
              id={this.state.id}
              color={this.state.user_color}
              socket={this.server_socket}
            />

            <OnlineUsers
              userName={this.state.username}
              id={this.state.id}
              socket={this.server_socket}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}
