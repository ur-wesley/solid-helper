import { $ } from "bun";

const tag = Bun.argv[2];
if (!tag) {
  throw new Error("TAG is required");
}
await $`git tag ${tag}`;
await $`git push origin ${tag}`;
