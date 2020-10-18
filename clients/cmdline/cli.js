#!/usr/bin/env node
require("yargs/yargs")(process.argv.slice(2))
  // .parserConfiguration()
  .commandDir("cmds", {
    // TODO: convert ts to js for real use
		extensions: process.env.NODE_ENV === "production" ? ["js"] : ["js", "ts"],
    visit: (commandModule) => {
      return commandModule.default;
    },
  })
  .demandCommand()
  .help().argv;
