const srcFolder = 'src';

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
      {
        type: 'modify',
        path: `${srcFolder}/config/registry.ts`,
        pattern: /(export const InitialRegistry = \{\n)/,
        template: `import {{pascalCase name}} from '@/components/{{dashCase name}}';\n\n$1  'component:{{dashCase name}}': {{pascalCase name}},\n`,
      },
    ],
  });
}
