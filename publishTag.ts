import { $ } from "bun";

const tag = Bun.argv[2];

if (!tag) {
  console.error("Error: TAG is required");
  process.exit(1);
}

if (tag !== "patch" && tag !== "minor" && tag !== "major") {
  console.error("Error: TAG must be 'patch', 'minor', or 'major'");
  process.exit(1);
}

try {
  await $`npm version ${tag}`;
} catch (error) {
  console.error("Error: Failed to update npm version", error);
  process.exit(1);
}

import { version } from "./package.json";
const tagName = `v${version}`;

try {
  await $`git rev-parse ${tagName}`;
  console.log(`Tag ${tagName} already exists`);
  process.exit(0);
} catch {
  try {
    await $`git tag ${tagName}`;
    await $`git push origin ${tagName}`;
    console.log(`Tag ${tagName} created and pushed successfully`);
  } catch (error) {
    console.error("Error: Failed to create or push git tag", error);
    process.exit(1);
  }
}
