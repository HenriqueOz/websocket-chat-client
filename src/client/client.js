import io from "socket.io-client";
import { MessageModel } from "../models/message_model.js";

export class Client {
  #host = process.env.HOST;
  #port = process.env.PORT;
  #url = `ws://${this.#host}:${this.#port}`;
  #socket = null;
  #inputHandler = null;
  #name = "";
  #hasPrintedErrorMessage = false;

  constructor({ name, inputHandler }) {
    this.#name = name;
    this.#inputHandler = inputHandler;
  }

  async connect() {
    this.#socket = io(this.#url, { autoConnect: false });
    this.#setupEvents();
    this.#socket.connect();
  }

  #setupEvents() {
    this.#socket.on("connect", () => {
      this.#inputHandler.printMessageAndPrompt(
        "connected to the server",
        "0;32"
      );

      this.#sendConnectionMessage({ name: this.#name });
    });

    this.#socket.on("message", (data) => {
      const message = MessageModel.fromJson({ json: data });

      this.#inputHandler.printChatMessageAndPrompt(
        message.author,
        message.body,
        "0;31"
      );
    });

    this.#socket.on("disconnect", () => {
      this.#inputHandler.printMessage("disconnected from the server", "0;32");
      this.#hasPrintedErrorMessage = false;
    });

    this.#socket.on("connect_error", (err) => {
      if (!this.#hasPrintedErrorMessage) {
        this.#inputHandler.printMessage(
          "error: can't connect to the server",
          "0;32"
        );
        this.#inputHandler.rl.prompt();
        this.#hasPrintedErrorMessage = true;
      }
    });
  }

  disconnect() {
    this.#socket.disconnect();
  }

  #sendConnectionMessage({ name }) {
    if (this.#socket.connected) {
      this.#socket.emit(
        "connection-message",
        JSON.stringify({
          name: name,
        })
      );
    }
  }

  broadcastMessage({ body }) {
    if (this.#socket.connected) {
      this.#socket.emit(
        "message",
        JSON.stringify(
          new MessageModel({
            author: this.#name,
            body: body,
            date: new Date().toISOString(),
          })
        )
      );
    }
  }
}
