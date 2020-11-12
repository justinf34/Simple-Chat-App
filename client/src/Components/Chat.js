import React, { Component } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      msg: "",
      show: false,
      alert: "",
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onNewMsgList = this.onNewMsgList.bind(this);
    this.onDeniedNameChange = this.onDeniedNameChange.bind(this);
  }

  handleClose() {
    this.setState({
      show: false,
    });
  }

  handleOpen() {
    this.setState({ show: true }, () => {
      window.setTimeout(() => {
        this.setState({ show: false });
      }, 2000);
    });
  }

  handleChange(e) {
    this.setState({ msg: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.msg) return;

    let msg = this.state.msg;

    if (msg.startsWith("/color")) {
      this.colorChange(msg);
    } else if (msg.startsWith("/name")) {
      this.nameChange(msg);
    } else {
      msg = msg
        .replaceAll(":)", "😁")
        .replaceAll(":(", "🙁")
        .replaceAll(":o", "😲");
      console.log("Sending message: ", msg);
      //send the socket message here
      const message = {
        id: this.props.id,
        type: 1,
        message: msg,
      };

      this.props.socket.sendMessage(message);
      this.setState({ msg: "" });
    }
  }

  onNewMsgList(msg_list) {
    this.setState({
      messages: msg_list,
    });
  }

  setAlert(msg) {
    this.setState(
      {
        show: true,
        alert: msg,
        msg: "",
      },
      () => {
        window.setTimeout(() => {
          this.setState({ show: false });
        }, 2000);
      }
    );
  }

  nameChange(msg) {
    const args = msg.split(" ");

    const RegExp = /\s/g;
    if (args.length != 2) {
      console.log("Wrong use of /name! Need the right amount of args!");
      this.setAlert("Wrong use of /name! Need the right amount of args!");
    } else {
      if (RegExp.test(args[1])) {
        console.log("Name must not contain spaces");
        this.setAlert("Name must not contain spaces");
      } else {
        console.log("Changing name....");
        this.props.socket.changeName(args[1]);
        this.setState({ msg: "" });
      }
    }
  }

  colorChange(msg) {
    const args = msg.split(" ");

    if (args.length != 2) {
      console.log("Wrong use of /color! Need the right amount of args!");
      this.setAlert("Wrong use of /color! Need the right amount of args!");
    } else {
      const RegExp = /^#([0-9A-F]{6}){1,2}$/i;

      if (RegExp.test("#" + args[1])) {
        console.log("Changing color....");
        this.props.socket.changeColor(args[1]);
        this.setState({ msg: "" });
      } else {
        console.log("Wrong use of /color! Invalid color!");
        console.log("Wrong use of /color! Invalid color!");
        this.setAlert("Wrong use of /color! Invalid color!");
      }
    }
  }

  renderMsgs() {
    const msgs_list = [];
    this.state.messages.forEach((msg, i) => {
      msgs_list.push(
        <div
          className="chat-message"
          key={i}
          style={{
            color: "#" + msg.color,
            fontWeight: msg.id === this.props.id ? "bold" : "normal",
          }}
        >
          {msg.date +
            " " +
            (msg.type === 0
              ? msg.id === this.props.id
                ? "You "
                : msg.author + " "
              : msg.author + ": ") +
            msg.message}
        </div>
      );
    });
    return msgs_list;
  }

  onDeniedNameChange() {
    console.log("Username taken");
    this.setAlert("Username taken!");
  }

  scrollToChatBottom() {
    this.panel.scrollTo(0, this.panel.scrollHeight);
  }

  componentDidMount() {
    const socket = this.props.socket;
    socket.registerNewMsgList(this.onNewMsgList);
    socket.registerDeniedNameChange(this.onDeniedNameChange);
  }

  componentDidUpdate() {
    this.scrollToChatBottom();
  }

  render() {
    console.log("Message", this.state.messages);
    return (
      <div className="chat-container">
        <Alert
          show={this.state.show}
          variant="danger"
          dismissible={true}
          onClose={this.handleClose}
          style={{
            margin: "auto",
            position: "absolute",
            top: "0%",
            left: "50%",
            transform: "translate(-50%, 0%)",
          }}
        >
          {this.state.alert}
        </Alert>

        <div
          className="chat-log"
          ref={(panel) => {
            this.panel = panel;
          }}
        >
          {this.renderMsgs()}
        </div>

        <Form className="chat-input-area" onSubmit={this.handleSubmit}>
          <Form.Control
            type="text"
            placeholder="Type a message.."
            value={this.state.msg}
            onChange={this.handleChange}
          />
          <Button type="submit">Send</Button>
        </Form>
      </div>
    );
  }
}
