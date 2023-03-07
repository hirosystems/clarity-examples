/*
Script to generate metadata.json file.

This should be run when the examples are modified.

Your locally installed version of Clarinet will be used as the supported Clarinet version.
If this is changing, confirm that each project is compatible.
*/

const fs = require("fs");
const cp = require("child_process");
const path = require("path");

const PROJECTS_ROOT = "examples/";
const METADATA_FILE = "metadata.json";

// Get the current Clarinet version
cp.execFile("./print-clarinet-version.sh", (error, stdout, stderr) => {
  const clarinetVersionOutput = stdout;
  const matches = clarinetVersionOutput.match(/\d+\.\d+\.\d+/);
  if (matches.length === 0) {
    throw new Error(
      `Could not parse current clarinet cli version, got: ${clarinetVersionOutput}`
    );
  }
  const clarinetVersion = matches[0];

  // Put all the example names and descriptions in JSON
  fs.readdir(PROJECTS_ROOT, (err, projects) => {
    if (err) throw err;
    const examples = projects.map((projectDir) => {
      const manifestPath = path.join(
        PROJECTS_ROOT,
        projectDir,
        "Clarinet.toml"
      );

      const manifestFile = fs.readFileSync(manifestPath, "utf8");

      // *super* basic parsing of the top level data in the manifest file
      const parsedManifest = manifestFile.split("\n").reduce((acc, line) => {
        const [key, value] = line.split("=");
        if (!key || !value) return acc;
        return { ...acc, [key.trim()]: value.trim().replaceAll('"', "") };
      }, {});

      return {
        title: parsedManifest.name,
        description: parsedManifest.description,
        path: path.join(PROJECTS_ROOT, projectDir),
      };
    });

    fs.writeFile(
      METADATA_FILE,
      JSON.stringify({ clarinetVersion, examples }, null, 2),
      "utf8",
      () => {
        console.log("✔ Successfully wrote metadata to metadata.json.");
      }
    );
  });
});
