import * as yargs from "yargs";
import { makePost } from "../../utils/helpers";

export default {
  command: "add <url>",
  aliases: [],
  describe: "Add a bookmark for <url>",
  builder: (yargs: yargs.Argv) => {
    return yargs
      .usage("Usage: $0 bm add <url> [options]")
      .options("t", {
        alias: "tag",
        describe: "Add a tag",
        default: "default",
      })
      .options("n", {
        alias: "name",
        describe: "Add a name to refer as",
      })
      .version(false);
  },
  handler: async (argv) => {
    // TODO: validation? or server side?
    const res = await makePost("/bookmark/add", {
      url: argv.url,
      name: argv.name,
      tag: argv.tag,
    });
    // TODO: error handling or dont need to?
    // TODO: success response or dont need to?
    console.log(res);
  },
} as yargs.CommandModule;
