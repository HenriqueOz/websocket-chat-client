import io from "socket.io-client";
import { MessageModel } from "./models/message_model.js";

export class Client {
  url = "ws://10.24.24.169:3001";
  socket = null;
  name = null;
  inputHandler = null;

  constructor({ name, inputHandler }) {
    this.name = name;
    this.inputHandler = inputHandler;
  }

  async connect() {
    this.socket = io(this.url);
    this.#setupEvents();
  }

  #setupEvents() {
    this.socket.on("connect", () => {
      this.inputHandler.print("connected to the server", "0;32");

      this.sendConnectionMessage({ name: this.name });
    });

    this.socket.on("message", (data) => {
      const message = MessageModel.fromJson({ json: data });

      this.inputHandler.printMessage(message.author, message.body, "0;31");
    });

    this.socket.on("disconnect", () => {
      this.inputHandler.print("disconnected from the server", "0;32");
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendConnectionMessage({ name }) {
    this.socket.emit(
      "connection-message",
      JSON.stringify({
        name: name,
      })
    );
  }

  broadcastMessage({ body }) {
    this.socket.emit(
      "message",
      JSON.stringify(
        new MessageModel({
          author: this.name,
          body: body,
          date: new Date().toISOString(),
          id: this.connId,
        })
      )
    );
  }
}
