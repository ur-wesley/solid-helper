import { $ } from "bun";

const tag = Bun.argv[2];

if (!tag) {
  console.error("Usage: bun run version-push.ts <version>");
  console.error("Example: bun run version-push.ts patch | minor | major");
  process.exit(1);
}

let tagName = "";
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

  // 3. Check if there are changes to commit
  const status = await $`git status --porcelain`;
  if (status.stdout.toString().trim()) {
    // 4. Commit the changes
    await $`git add package.json`;
    await $`git commit -m "chore(release): bump version to ${newVersion}"`;
  } else {
    console.log("No changes to commit");
  }

  // 5. Create a git tag
  tagName = `v${newVersion}`;
  try {
    await $`git rev-parse --verify ${tagName}`;
    console.log(`Tag ${tagName} already exists`);
  } catch {
    await $`git tag ${tagName}`;
    console.log(`Created tag: ${tagName}`);
  }

  // 6. Push changes and tag to the remote repository
  await $`git push origin main --follow-tags`;
  console.log(`Pushed changes and tag: ${tagName}`);
} catch (error) {
  console.error("Error occurred:", error);
  // remove the tag if it was created
  await $`git tag -d ${tagName}`;
  process.exit(1);
}
