import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      msg: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onNewMsgList = this.onNewMsgList.bind(this);
  }

  handleChange(e) {
    this.setState({ msg: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.msg) return;

    let msg = this.state.msg;

    if (this.state.msg.startsWith("/color")) {
      this.colorChange(msg);
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
    }

    this.setState({ msg: "" });
  }

  onNewMsgList(msg_list) {
    this.setState({
      messages: msg_list,
    });
  }

  colorChange(msg) {
    const args = msg.split(" ");

    if (args.length != 2) {
      console.log("Wrong use of /color! Need the right amount of args!");
    } else {
      const RegExp = /^#([0-9A-F]{6}){1,2}$/i;

      if (RegExp.test("#" + args[1])) {
        // Tell server I changed colour
        console.log("Changing color....");
        this.props.socket.changeColor(args[1]);
      } else {
        // set alert
        console.log("Invalid color");
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

  scrollToChatBottom() {
    this.panel.scrollTo(0, this.panel.scrollHeight);
  }

  componentDidMount() {
    const socket = this.props.socket;
    socket.registerNewMsgList(this.onNewMsgList);
  }

  componentDidUpdate() {
    this.scrollToChatBottom();
  }

  render() {
    console.log("Message", this.state.messages);
    return (
      <div className="chat-container">
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
