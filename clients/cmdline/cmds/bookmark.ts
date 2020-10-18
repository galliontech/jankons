import * as yargs from "yargs";
import { commandDirOptions } from "../utils/helpers";

export default {
  command: "bookmark <command>",
  aliases: ["bm"],
  describe: "Add, remove or list new bookmarks or interesting reads",
  builder: (yargs: yargs.Argv) => {
    return yargs
      .usage("Usage: $0 bm <command> [options]")
      .commandDir("bookmark", commandDirOptions)
      .demandCommand()
      .version(false);
  },
  handler: (argv) => {},
} as yargs.CommandModule;
