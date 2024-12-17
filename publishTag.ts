import { $ } from "bun";

const tag = Bun.argv[2];

if (!tag) {
  throw new Error("TAG is required");
}

switch (tag) {
  case "major":
    await $`npm version major`;
    break;
  case "minor":
    await $`npm version minor`;
    break;
  case "patch":
    await $`npm version patch`;
    break;
  default:
    throw new Error("Invalid tag");
}

const version = "v" + require("./package.json").version;

await $`git tag ${version}`;
await $`git push origin ${version}`;
