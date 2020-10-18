import * as yargs from "yargs";
import { makeGet } from "../../utils/helpers";

export default {
  command: "ls",
  aliases: ["list"],
  describe: "List all available bookmarks",
  builder: (yargs: yargs.Argv) => {
    return yargs
      .usage("Usage: $0 bm ls [options]")
      .options("t", {
        alias: "tag",
        describe: "Add a tag",
        default: "default",
      })
      .options("s", {
        alias: "skip",
        describe: "Amount in list to skip for pagination",
      })
      .options("q", {
        alias: "take",
        describe: "Amount in list to display",
        default: 20, // TODO: shared directory for stuff like this
      })
      .version(false);
  },
  handler: async (argv) => {
    const res = await makeGet("/bookmark/list", {
      tag: argv.tag,
      skip: argv.skip,
      take: argv.take,
    });
    console.log(res);
  },
} as yargs.CommandModule;
