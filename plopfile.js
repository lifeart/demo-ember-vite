import fs from 'fs';
import EmberRouterGenerator from 'ember-router-generator';
import { pascalCase, paramCase } from 'change-case';

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
    .map((item) => paramCase(item))
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
      {
        type: 'add',
        path: `${srcFolder}/components/{{pathWithoutTail (dasherize name)}}/{{pathTail (dasherize name)}}-test.ts`,
        templateFile: 'blueprints/component/test.hbs',
      },
      registeringAction('component'),
    ],
  });

  plop.setGenerator('controller', {
    description: 'Generates a controller',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      classAction('controller'),
      registeringAction('controller'),
      {
        type: 'add',
        path: `tests/unit/controllers/{{pathWithoutTail (dasherize name)}}/{{pathTail (dasherize name)}}-test.ts`,
        templateFile: 'blueprints/controller/test.hbs',
      },
    ],
  });

  plop.setGenerator('helper', {
    description: 'Generates a helper',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      classAction('helper'),
      registeringAction('helper'),
      {
        type: 'add',
        path: `tests/integration/helpers/{{dasherize name}}-test.ts`,
        templateFile: 'blueprints/helper/test.hbs',
      },
    ],
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
      {
        type: 'add',
        path: `tests/unit/initializers/{{dasherize name}}-test.ts`,
        templateFile: 'blueprints/initializer/test.hbs',
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
      {
        type: 'add',
        path: `tests/unit/instance-initializers/{{dasherize name}}-test.ts`,
        templateFile: 'blueprints/instance-initializer/test.hbs',
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
    actions: [
      classAction('service'),
      registeringAction('service'),
      {
        type: 'add',
        path: `tests/unit/services/{{dasherize name}}-test.ts`,
        templateFile: 'blueprints/service/test.hbs',
      },
    ],
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
    actions: [
      classAction('util'),
      registeringAction('util'),
      {
        type: 'add',
        path: `tests/unit/utils/{{dasherize name}}-test.ts`,
        templateFile: 'blueprints/util/test.hbs',
      },
    ],
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

  plop.addHelper('pathWithoutTail', function (text) {
    let parts = text.split('/');

    if (parts.length > 1) {
      parts = parts.slice(0, -1);
    }

    return parts.join('/');
  });

  plop.addHelper('pathTail', function (text) {
    return text.split('/').pop();
  });

  plop.addHelper('toTemplateComponentName', function (text) {
    return text
      .split('/')
      .map((item) => pascalCase(item))
      .join('::');
  });
}
