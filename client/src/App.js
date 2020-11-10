import React, { Component } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Chat from "./Components/Chat";

import socket from "./Utils/socket";
import { Button } from "react-bootstrap";
import OnlineUsers from "./Components/OnlineUsers";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.server_socket = socket();
    this.state = {
      connected: false,
      username: null,
    };

    this.onRetry = this.onRetry.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
  }

  /**
   * Get a valid username from the server
   */
  async getUserName() {
    try {
      const res = await fetch("http://localhost:8888/username", {
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
        .find((row) => row.startsWith("user_name"))
        .split("=")[1];
      console.log("getUserName: ", cookieValue);

      return cookieValue;
    } catch (error) {
      throw error;
    }
  }

  onRetry() {
    this.getUserName()
      .then((new_user_name) => {
        this.server_socket.joinRoom(new_user_name);

        // Register to some event handlers

        this.setState({
          username: new_user_name,
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
    this.getUserName()
      .then((new_user_name) => {
        this.server_socket.joinRoom(new_user_name);

        // Register to some event handlers
        this.server_socket.registerDisconnect(this.onDisconnect);

        this.setState({
          username: new_user_name,
          connected: true,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="App">
        {!this.state.username ? (
          <div className="no-connection">
            <h3>Cannot connect to the server :^(</h3>
            <Button onClick={this.onRetry}>Retry</Button>
          </div>
        ) : (
          <React.Fragment>
            <Chat />
            <OnlineUsers
              userName={this.state.username}
              socket={this.server_socket}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}
