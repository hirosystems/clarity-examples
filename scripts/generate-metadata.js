/**
 * Script to generate metadata.json file.
 *
 * This should be run when the examples are modified.
 *
 * Your locally installed version of Clarinet will be used as the supported Clarinet version.
 * If this is changing, confirm that each project is compatible.
 */

const fs = require("fs");
const cp = require("child_process");

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
  fs.readdir(PROJECTS_ROOT, async (err, projects) => {
    if (err) throw err;
    const projectPromises = projects.map((project) => {
      const projectName = project.toString();
      const descriptionFilePath = `${PROJECTS_ROOT}${projectName}/description.txt`;
      const description = fs.readFileSync(descriptionFilePath, "utf8");

      return {
        title: projectName,
        description,
        path: `${PROJECTS_ROOT}${projectName}`,
      };
    });
    const projectData = await Promise.all(projectPromises);

    fs.writeFile(
      METADATA_FILE,
      JSON.stringify({
        clarinetVersion,
        examples: projectData,
      }),
      "utf8",
      () => {
        console.log("✔ Successfully wrote metadata to metadata.json.");
      }
    );
  });
});
