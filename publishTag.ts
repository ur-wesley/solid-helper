import { $ } from "bun";

const tag = Bun.argv[2];

if (!tag) {
  console.error("Usage: bun run version-push.ts <version>");
  console.error("Example: bun run version-push.ts patch | minor | major");
  process.exit(1);
}

try {
  // 1. Bump version in package.json
  console.log(`Bumping version (${tag})...`);
  await $`npm version ${tag}`;

  // 2. Get the new version from package.json
  const packageJson = await Bun.file("package.json").text();
  const newVersion = JSON.parse(packageJson).version;

  if (!newVersion) {
    console.error("Failed to determine the new version from package.json.");
    process.exit(1);
  }

  console.log(`New version: v${newVersion}`);

  // 3. Commit the changes
  await $`git add package.json`;
  await $`git commit -m "chore(release): bump version to ${newVersion}"`;

  // 4. Create a git tag
  const tagName = `v${newVersion}`;
  await $`git tag ${tagName}`;
  console.log(`Created tag: ${tagName}`);

  // 5. Push changes and tag to the remote repository
  await $`git push origin main --follow-tags`;
  console.log(`Pushed changes and tag: ${tagName}`);
} catch (error) {
  console.error("Error occurred:", error);
  process.exit(1);
}
