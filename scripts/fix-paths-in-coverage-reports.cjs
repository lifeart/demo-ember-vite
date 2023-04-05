const fs = require('node:fs');
const path = require('node:path');

const inputFolderName = 'artifacts';
const outputFolderName = 'coverage-artifacts';

const inputPath = path.join(__dirname, '..', inputFolderName);
const outputPath = path.join(__dirname, '..', outputFolderName);

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

function fixAssetPath(oldPath, entryPath) {
  const key = oldPath.split('\\').join('/');
  const parts = key.split('/src/');
  parts.shift();
  return path.join(entryPath, 'src', ...parts);
}

function processItems() {
  if (!fs.existsSync(inputPath)) {
    console.info(`"${inputFolderName}" folder does not exist`);
    return;
  }

  const artifacts = fs.readdirSync(inputPath);
  artifacts.forEach((artifactName) => {
    const originalName = artifactName;
    const stats = fs.statSync(path.join(inputPath, artifactName));
    if (stats.isDirectory()) {
      // pick first file in directory and assign path to artifact name
      const files = fs.readdirSync(path.join(inputPath, artifactName));
      // print out all files in directory
      const file = files[0];
      artifactName = `${artifactName}/${file}`;
    }
    if (!artifactName.endsWith('.json')) {
      return;
    }
    console.info(`Processing ${artifactName}`);
    const artifactPath = path.join(inputPath, artifactName);
    const artifact = fs.readFileSync(artifactPath, 'utf8');
    const artifactJson = JSON.parse(artifact);
    const newArtifact = {};
    const correctDirName = path.join(__dirname, '..');

    Object.keys(artifactJson).forEach((key) => {
      const newKey = fixAssetPath(key, correctDirName);
      const content = artifactJson[key];
      content.path = fixAssetPath(content.path, correctDirName);
      newArtifact[newKey] = content;
    });
    fs.writeFileSync(
      path.join(outputPath, originalName.split('.')[0] + '.json'),
      JSON.stringify(newArtifact)
    );
  });

  console.info('Done, processed artifacts:');
  console.info(fs.readdirSync(outputPath));
}

processItems();
