const { Command } = require("commander");
const program = new Command();

program
  .name("composter")
  .description("Component vault CLI")
  .version("1.0.0");

program
  .command("login")
  .description("login and store API key")
  .action(() => {
    console.log("login called");
  });

program
  .command("push <file>")
  .description("push a component")
  .action((file) => {
    console.log("push called", file);
  });

program
  .command("list")
  .description("list components")
  .action(() => {
    console.log("list called");
  });

program.parse();
