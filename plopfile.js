import fs from 'fs';
import slugify from 'slugify';
import EmberRouterGenerator from 'ember-router-generator';

const srcFolder = 'src';

function registeringAction(blueprint) {
  return {
    type: 'modify',
    path: `${srcFolder}/config/registry.ts`,
    pattern: /(export const InitialRegistry = \{\n)/,
    template: `import {{pascalCase name}}{{pascalCase '${blueprint}'}} from '../${blueprint}s/{{dasherize name}}';\n\n$1  '${blueprint}:{{dasherize name}}': {{pascalCase name}}{{pascalCase '${blueprint}'}},\n`,
  };
}

function importInitializer(blueprint) {
  return {
    type: 'modify',
    path: `${srcFolder}/config/initializer.ts`,
    pattern: /^/,
    template: `import {{pascalCase name}}{{pascalCase '${blueprint}'}} from '../${blueprint}s/{{dasherize name}}';\n`,
  };
}

function classAction(blueprint) {
  return {
    type: 'add',
    path: `${srcFolder}/${blueprint}s/{{dasherize name}}.ts`,
    templateFile: `blueprints/${blueprint}/class.hbs`,
  };
}

// The `dasherize` helper doesn't break subfolder paths
function dasherize(text) {
  return text
    .split('/')
    .map((item) => slugify(item))
    .join('/');
}

export default function (plop) {
  plop.setGenerator('component', {
    description: 'Generates a component',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/components/{{dasherize name}}/index.ts`,
        templateFile: 'blueprints/component/class.hbs',
      },
      {
        type: 'add',
        path: `${srcFolder}/components/{{dasherize name}}/template.hbs`,
        templateFile: 'blueprints/component/template.hbs',
      },
      registeringAction('component'),
    ],
  });

  plop.setGenerator('controller', {
    description: 'Generates a controller',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [classAction('controller'), registeringAction('controller')],
  });

  plop.setGenerator('helper', {
    description: 'Generates a helper',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [classAction('helper'), registeringAction('helper')],
  });

  plop.setGenerator('initializer', {
    description: 'Generates a initializer',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      classAction('initializer'),
      registeringAction('initializer'),
      importInitializer('initializer'),
      {
        type: 'modify',
        path: `${srcFolder}/config/initializer.ts`,
        pattern: /([\t ]*)(const app = Application\.create\({\n)/,
        template: `$1Application.initializer({{pascalCase name}}{{pascalCase 'initializer'}});\n\n$1$2`,
      },
    ],
  });

  plop.setGenerator('instance-initializer', {
    description: 'Generates a instance-initializer',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      classAction('instance-initializer'),
      registeringAction('instance-initializer'),
      importInitializer('instance-initializer'),
      {
        type: 'modify',
        path: `${srcFolder}/config/initializer.ts`,
        pattern: /([\t ]*)(const app = Application\.create\({\n)/,
        template: `$1Application.instanceInitializer({{pascalCase name}}{{pascalCase 'instance-initializer'}});\n\n$1$2`,
      },
    ],
  });

  plop.setGenerator('route', {
    description: 'Generates a route',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      classAction('route'),
      {
        type: 'add',
        path: `${srcFolder}/templates/{{dasherize name}}.hbs`,
        templateFile: 'blueprints/route/template.hbs',
      },
      registeringAction('route'),
      {
        type: 'add-to-router',
      },
    ],
  });

  plop.setGenerator('service', {
    description: 'Generates a service',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [classAction('service'), registeringAction('service')],
  });

  plop.setGenerator('template', {
    description: 'Generates a template',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/templates/{{dasherize name}}.hbs`,
        templateFile: 'blueprints/template/template.hbs',
      },
      registeringAction('template'),
    ],
  });

  plop.setGenerator('util', {
    description: 'Generates a util',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [classAction('util'), registeringAction('util')],
  });

  plop.setActionType('add-to-router', function (answers) {
    const routerPath = `${srcFolder}/router.ts`;
    const source = fs.readFileSync(routerPath, 'utf-8');
    const routes = new EmberRouterGenerator(source);
    const newRoutes = routes.add(dasherize(answers.name));

    fs.writeFileSync(routerPath, newRoutes.code());
  });

  plop.addHelper('dasherize', function (text) {
    return dasherize(text);
  });
}
