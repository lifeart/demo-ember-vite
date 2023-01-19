import slugify from 'slugify';

const srcFolder = 'src';

function registeringAction(blueprint) {
  return {
    type: 'modify',
    path: `${srcFolder}/config/registry.ts`,
    pattern: /(export const InitialRegistry = \{\n)/,
    template: `import {{pascalCase name}}{{pascalCase '${blueprint}'}} from '@/${blueprint}s/{{slugify name}}';\n\n$1  '${blueprint}:{{slugify name}}': {{pascalCase name}}{{pascalCase '${blueprint}'}},\n`,
  };
}

function classAction(blueprint) {
  return {
    type: 'add',
    path: `${srcFolder}/${blueprint}s/{{slugify name}}.ts`,
    templateFile: `blueprints/${blueprint}/class.hbs`,
  };
}

export default function (plop) {
  plop.setGenerator('component', {
    description: 'Generates a component',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/components/{{slugify name}}/index.ts`,
        templateFile: 'blueprints/component/class.hbs',
      },
      {
        type: 'add',
        path: `${srcFolder}/components/{{slugify name}}/template.hbs`,
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
    actions: [classAction('initializer'), registeringAction('initializer')],
  });

  plop.setGenerator('instance-initializer', {
    description: 'Generates a instance-initializer',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      classAction('instance-initializer'),
      registeringAction('instance-initializer'),
    ],
  });

  plop.setGenerator('route', {
    description: 'Generates a route',
    prompts: [{ type: 'input', name: 'name' }],
    actions: [
      classAction('route'),
      {
        type: 'add',
        path: `${srcFolder}/templates/{{slugify name}}.hbs`,
        templateFile: 'blueprints/route/template.hbs',
      },
      registeringAction('route'),
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
        path: `${srcFolder}/templates/{{slugify name}}.hbs`,
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

  // The `slugify` helper doesn't break subfolder paths
  plop.addHelper('slugify', function (text) {
    return text
      .split('/')
      .map((item) => slugify(item))
      .join('/');
  });
}
