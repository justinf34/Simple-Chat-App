import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

export default class Chat extends Component {
  render() {
    return (
      <div className="chat-container">
        <div className="chat-log"></div>
        <Form className="chat-input-area">
          <Form.Control
            type="text"
            placeholder="Type a message.."
            // value={this.state.msg_input}
            // onChange={this.handleChange}
          />
          <Button onClick={() => console.log(document.cookie)}>Send</Button>
        </Form>
      </div>
    );
  }
}
