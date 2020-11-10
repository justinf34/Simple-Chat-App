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
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => {
        // Get value of user name cookie
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_name"))
          .split("=")[1];
        console.log(cookieValue);

        this.setState({
          username: cookieValue,
        });
      })
      .catch((err) => {
        console.log(err);
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
