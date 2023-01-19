const srcFolder = 'src';

function registeringAction(blueprint) {
  return {
    type: 'modify',
    path: `${srcFolder}/config/registry.ts`,
    pattern: /(export const InitialRegistry = \{\n)/,
    template: `import {{pascalCase name}}{{pascalCase '${blueprint}'}} from '@/${blueprint}s/{{dashCase name}}';\n\n$1  '${blueprint}:{{dashCase name}}': {{pascalCase name}}{{pascalCase '${blueprint}'}},\n`,
  };
}

function classAction(blueprint) {
  return {
    type: 'add',
    path: `${srcFolder}/${blueprint}s/{{dashCase name}}.ts`,
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
        path: `${srcFolder}/components/{{dashCase name}}/index.ts`,
        templateFile: 'blueprints/component/class.hbs',
      },
      {
        type: 'add',
        path: `${srcFolder}/components/{{dashCase name}}/template.hbs`,
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
        path: `${srcFolder}/templates/{{dashCase name}}.hbs`,
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
        path: `${srcFolder}/templates/{{dashCase name}}.hbs`,
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
}
