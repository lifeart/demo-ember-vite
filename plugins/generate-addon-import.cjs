const path = require('node:path');
const packageName = process.argv.slice().pop();
const walkSync = require('walk-sync');
const addonPath = path.join(__dirname, '..', 'node_modules', packageName);
const addonPackage = require(`${addonPath}/package.json`);
const fs = require('node:fs');

const prettyName = packageName.split('/').join('-').replace('@', '');

if (!addonPackage.keywords.includes('ember-addon')) {
    throw new Error(`${packageName} is not an ember addon`);
}

console.info(`Sample usage: yarn gif ember-basic-dropdown`);

console.log(`Generating import for ${packageName}...`);

const paths = walkSync(path.join(addonPath, 'addon'), { globs: ['**/*.{ts,js,hbs}'] });

const uniquePaths = {};
paths.forEach((p) => {
    const [fPath, extension] = p.split('.');
    const [scope, name] = fPath.split('/');
    if (!(fPath in uniquePaths)) {
        uniquePaths[fPath] = {
            relativePath: `${packageName}/addon/${fPath}`,
            scope,
            name,
            extensions: [],
        }
    }
    uniquePaths[fPath].extensions.push(extension);
});

function nameForScope(scope) {
    switch (scope) {
        case 'components':
            return 'Component';
        case 'helpers':
            return 'Helper';
        case 'services':
            return 'Service';
        case 'templates':
            return 'Template';
        case 'modifiers':
            return 'Modifier';
        default:
            return 'X';
    }
}

function camelCase(str) {
    return str.split('.').join('-').replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const imports = [];
const registry = [];


let hasSetComponentTemplate = false;

Object.keys(uniquePaths).forEach((p) => {
    const {
        relativePath,
        scope,
        name,
        extensions,
    } = uniquePaths[p];
    const importNames = [];
    extensions.forEach((e) => {
        const nameForImport = capitalize(`${camelCase(name)}${nameForScope(scope)}${e === 'hbs' ? 'Template' : ''}`);
        const impName = `import ${nameForImport} from "${relativePath}${e === 'hbs' ? '.hbs' : ''}";`;
        imports.push(impName);
        importNames.push(nameForImport);
    });

    if (importNames.length > 1) {
        const tpl = importNames.find((n) => n.includes('Template'));
        const comp = importNames.find((n) => n !== tpl);
        registry.push([
            `component:${name}`,
            `setComponentTemplate(${tpl}, ${comp})`,
        ]);
        hasSetComponentTemplate = true;
    } else {
        registry.push([`${scope}:${name}`, importNames[0]]);
    }
});

const mergedRegistry = registry.map((r) => "    '" + r.join("': ") + ',').join('\n');


if (hasSetComponentTemplate) {
    imports.push('import { setComponentTemplate} from "@glimmer/manager";');
}

const tpl = `
${imports.join('\n')}

const registry = {
${mergedRegistry}
}

export default registry;
`;
// console.log(imports);
// console.table(registry);
// console.log(tpl);

fs.writeFileSync(path.join(__dirname, '..', 'src', 'addons', `${prettyName}.ts`), tpl);

const prettyImportName = `${capitalize(camelCase(prettyName))}Registry`;
const registryImportName = `import ${prettyImportName} from "./${prettyName}";`;

const indexContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'addons', 'index.ts'), 'utf8');

const newContent = registryImportName + '\n' + indexContent.replace('= {', '= {\n    ...' + prettyImportName + ',');

fs.writeFileSync(path.join(__dirname, '..', 'src', 'addons', 'index.ts'), newContent);