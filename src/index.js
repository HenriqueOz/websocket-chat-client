import { InputHandler } from "./input_handler/input_handler.js";
import { Client } from "./client/client.js";

async function main() {
  const inputHandler = new InputHandler();

  inputHandler.printMessage(
    "Type 'exit' or 'EXIT' to, surprisingly, exit",
    "0;32"
  );
  const name = await inputHandler.askQuestion("What's your name? ");
  const client = new Client({ name: name, inputHandler: inputHandler });

  client.connect();

  inputHandler.onInput((line) => {
    if (line.toString().toLowerCase() === "exit") {
      client.disconnect();
      inputHandler.close();
      process.exit();
    } else {
      inputHandler.rl.prompt();
      client.broadcastMessage({ body: line });
    }
  });

  process.on("SIGINT", () => {
    client.disconnect();
    inputHandler.close();
    process.exit();
  });
}

main();
