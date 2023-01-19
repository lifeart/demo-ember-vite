const srcFolder = 'src';

function registeringAction(blueprint) {
  return {
    type: 'modify',
    path: `${srcFolder}/config/registry.ts`,
    pattern: /(export const InitialRegistry = \{\n)/,
    template: `import {{pascalCase name}}{{pascalCase '${blueprint}'}} from '@/${blueprint}s/{{dashCase name}}';\n\n$1  '${blueprint}:{{dashCase name}}': {{pascalCase name}}{{pascalCase '${blueprint}'}},\n`,
  };
}

export default function (plop) {
  plop.setGenerator('component', {
    description: 'Generates a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
      },
    ],
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
    prompts: [
      {
        type: 'input',
        name: 'name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/controllers/{{dashCase name}}.ts`,
        templateFile: 'blueprints/controller/class.hbs',
      },
      registeringAction('controller'),
    ],
  });

  plop.setGenerator('helper', {
    description: 'Generates a helper',
    prompts: [
      {
        type: 'input',
        name: 'name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/helpers/{{dashCase name}}.ts`,
        templateFile: 'blueprints/helper/class.hbs',
      },
      registeringAction('helper'),
    ],
  });

  plop.setGenerator('initializer', {
    description: 'Generates a initializer',
    prompts: [
      {
        type: 'input',
        name: 'name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/initializers/{{dashCase name}}.ts`,
        templateFile: 'blueprints/initializer/class.hbs',
      },
      registeringAction('initializer'),
    ],
  });

  plop.setGenerator('instance-initializer', {
    description: 'Generates a instance-initializer',
    prompts: [
      {
        type: 'input',
        name: 'name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/instance-initializers/{{dashCase name}}.ts`,
        templateFile: 'blueprints/instance-initializer/class.hbs',
      },
      registeringAction('instance-initializer'),
    ],
  });

  plop.setGenerator('route', {
    description: 'Generates a route',
    prompts: [
      {
        type: 'input',
        name: 'name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/routes/{{dashCase name}}.ts`,
        templateFile: 'blueprints/route/class.hbs',
      },
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
    prompts: [
      {
        type: 'input',
        name: 'name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/services/{{dashCase name}}.ts`,
        templateFile: 'blueprints/service/class.hbs',
      },
      registeringAction('service'),
    ],
  });

  plop.setGenerator('template', {
    description: 'Generates a template',
    prompts: [
      {
        type: 'input',
        name: 'name',
      },
    ],
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
    prompts: [
      {
        type: 'input',
        name: 'name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${srcFolder}/utils/{{dashCase name}}.ts`,
        templateFile: 'blueprints/util/class.hbs',
      },
      registeringAction('util'),
    ],
  });
}
