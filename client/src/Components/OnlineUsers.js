import React, { Component } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export default class OnlineUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_list: [],
    };

    this.onUsersList = this.onUsersList.bind(this);
    this.onNewUser = this.onNewUser.bind(this);
    this.onLeaveUser = this.onLeaveUser.bind(this);
  }

  generateUserList() {
    const list = [];
    this.state.user_list.forEach((element, i) => {
      let li = (
        <ListGroupItem className="border-0" key={i}>
          <div
            className="user-li"
            style={{
              color: "#" + element.color,
              fontWeight: element.id === this.props.id ? "bold" : "normal",
            }}
          >
            {element.name + (element.id === this.props.id ? "(You)" : "")}
          </div>
        </ListGroupItem>
      );

      if (element.id === this.props.id) {
        list.unshift(li);
      } else {
        list.push(li);
      }
    });

    return list;
  }

  onUsersList(list) {
    console.log("onUsersList", list);
    this.setState({
      user_list: list,
    });
  }

  //TODO: Optimize
  onNewUser(user) {
    console.log("onNewUser", user);
    this.setState((prevState, prevProps) => {
      prevState.push(user);
      return {};
    });
  }

  // TODO: Optimize
  onLeaveUser(user) {
    console.log("onLeaveUser");
    this.setState((prevState, prevProps) => {
      prevState.user_list.splice(
        prevState.user_list.findIndex((usr) => usr.name === user.name),
        1
      );

      return {};
    });
  }

  componentDidMount() {
    const socket = this.props.socket;
    socket.registerUsersList(this.onUsersList);
    socket.registerNewUser(this.onUsersList);
    socket.registerLeaveUser(this.onUsersList);
  }

  //   componentDidUpdate() {
  //     // we might need this later
  //   }

  //   componentWillUnmount() {
  //     // unsubscribe to some event listeners
  //   }

  render() {
    return (
      <div className="online-user-container">
        <div className="online-user-header">
          <b>Online users:</b>
        </div>
        <div className="online-user-list">
          <ListGroup>{this.generateUserList()}</ListGroup>
        </div>
      </div>
    );
  }
}
