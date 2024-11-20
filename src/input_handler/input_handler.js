import chalk from "chalk";
import { stdout } from "node:process";
import readline from "node:readline";

export class InputHandler {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.blue("you: "),
  });

  constructor() {}

  askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => resolve(answer));
    });
  }

  clearLine() {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
  }

  printMessage(message, color = "") {
    this.clearLine();
    console.log(`\x1b[${color}m${message}\x1b[0m`);
  }

  printMessageAndPrompt(message, color) {
    this.printMessage(message, color);
    this.rl.prompt(true);
  }

  printChatMessageAndPrompt(author, message, color = "") {
    this.clearLine();
    console.log(`\x1b[${color}m${author}: \x1b[0m${message}`);
    this.rl.prompt(true);
  }

  onInput(callback) {
    this.rl.on("line", (line) => {
      callback(line);
    });
  }

  close() {
    this.rl.close();
  }
}
