const fs = require("fs");

const STARTERS_ROOT = "starters/";
const METADATA_FILE = "metadata.json";

fs.readdir(STARTERS_ROOT, async (err, projects) => {
  if (err) throw err;
  const projectPromises = projects.map((project) => {
    const projectName = project.toString();
    const descriptionFilePath = `${STARTERS_ROOT}${projectName}/description.txt`;
    const description = fs.readFileSync(descriptionFilePath, "utf8");

    return {
      title: projectName,
      description,
      path: `${STARTERS_ROOT}${projectName}`,
    };
  });
  const projectData = await Promise.all(projectPromises);

  fs.writeFile(METADATA_FILE, JSON.stringify(projectData), "utf8", () => {});
});
