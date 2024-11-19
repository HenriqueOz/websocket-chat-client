import { InputHandler } from "./input_handler.js";
import { Client } from "./client.js";
import chalk from "chalk";

async function main() {
  const inputHandler = new InputHandler();

  const name = await inputHandler.askQuestion("What's your name? ");
  const client = new Client({ name: name, inputHandler: inputHandler });

  client.connect();

  inputHandler.onInput((line) => {
    if (line === "exit") {
      client.disconnect();
      inputHandler.close();
      process.exit();
    } else {
      inputHandler.rl.prompt();
      client.broadcastMessage({ body: line });
    }
  });
}

main();
