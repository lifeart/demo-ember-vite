# Ember Vite

<img align="right" width="32" height="32"
     alt="Vite logo"
     src="./public/vite.svg">
<img align="right" width="100" height="100"
     alt="Ember.js logo"
     src="./public/ember.svg">

This is [Ember application](https://ember-vite.netlify.app/) running only on [Vite](https://vitejs.dev/). [![Netlify Status](https://api.netlify.com/api/v1/badges/ea52e30e-79bc-4f23-9e2f-321abab60b85/deploy-status)](https://ember-vite.netlify.app/)

* It's `TypeScript`'ed by default.
* It uses `vite` to build the app.
* `tailwind` used for styling.
* `playwright` used for testing.


## Table of Contents

* [Description](#description)
* [Demo](#demo)
* [Motivation](#motivation)
* [Features](#features)
* [Unsupported](#unsupported)
* [Installation](#installation)
* [Addons](#in-scope-of-this-app-we-able-to-run-this-addons)
* [Why?](#why)
* [Disclaimer](#disclaimer)


## Description

Main `difference` with classic Ember application is that we don't trying to `automatically` resolve addons and it's dependencies - we just `import` them directly, `only` once needed.

This application does not use `ember-cli` or `embroider` at all.

## Motivation

- 🚀 Hot Module Replacement support
- ⚡️ No complex build process
- 💡 Instant Server Start
- 🛠️ Rich customization features
- 📦 Optimized Build
- 🔩 A lot of supported addons
- 🔑 TypeScripted by default
- :four_leaf_clover: Playwright tests

## Features

1. Hot Module Replacement
1. Strict mode
1. Ember-Data support
1. Lazy-loading for routes
1. Template-only components
1. Style imports from components
1. Ember Inspector
1. Template imports support (`.gts` & `.gjs`)
1. Glint support
1. Testing support (QUnit)
1. Template linting
1. Playwright testing

## Demo

1. [Production App on Netlify](https://ember-vite.netlify.app/)
1. [Development environment on Stackblitz](https://stackblitz.com/github/lifeart/demo-ember-vite)

## Installation

```bash
yarn install
yarn dev
# open http://localhost:4200
```

## In scope of this app we able to run this addons

1. `ember-simple-auth`
1. `ember-bootstrap`
1. `ember-concurrency`
1. `ember-intl`
1. `ember-concurrency-decorators`
1. `ember-render-modifiers`
1. `ember-truth-helpers`
1. `ember-basic-dropdown`
1. `ember-power-select`
1. `ember-style-modifier`
1. `ember-assign-helper`
1. `ember-element-helper`
1. `ember-page-title`
1. `ember-notify`
1. `ember-ref-bucket`
1. `ember-modal-dialog`
1. `ember-responsive`
1. `ember-event-helpers`

[(see code for samples)](https://github.com/lifeart/demo-ember-vite/tree/master/src/addons)


*This is not complete list, and you could add `any` ember addon you want (if it don't have `ember-cli` logic)*

## Why?

I would like to bulletproof opinion, that modern ember application could be statically resolvable by default, and I would like to use `Vite` for that. It give as ability to use `TypeScript` and `ESM` by default, and it's very fast.

## Disclaimer

I'm not planning to actively maintain this repo, but if you have any questions, feel free to ask.

In addition, if you looking for options to improve speed of your ember project and you open for contracts - don't shy to contact me.

---

PR's are welcome.

---

## How to add new addon?

1. Install dependency `yarn add addon-name`.
2. Create `addon-name.ts` file in `src/addons` folder.
3. Import needed `helpers`, `modifiers`, `components`, `services` from `addon-name` (check samples in same folder).

> We should keep extensions while importing, don't forget to check correct path's from `node_modules/addon-name` folder.

> Do not forget to `setComponentTemplate` for components.
```ts
import SayHello from 'addon-name/components/my-component.js';
import SayHelloTemplate from 'addon-name/templates/my-component.hbs';
import CalcHelper from 'addon-name/helpers/calc.js';
import SummaryModifier from 'addon-name/modifiers/summary.js';
import SomeService from 'addon-name/services/some-service.js';
import { setComponentTemplate } from '@glimmer/manager';

setComponentTemplate(SayHelloTemplate, SayHello);
```
4. Create registry object for addon (check samples in same folder)
```ts
const registry = {
     'component:say-hello': SayHello,
     'helper:calc': CalcHelper,
     'modifier:summary': SummaryModifier,
     'service:some-service': SomeService,
}
```
5. Export registry object in `addon-name.ts` file
```ts
export default registry;
```
6. Import created registry object in `src/addons/index.ts` file
```ts
import AddonName from './addon-name';

const registry = {
     // ... other addons
     ...AddonName,
}
```

Now we have new addon in our project. It should work out of the box for classic ember components. If you need to use it from `gts` / `gjs` files - you should import it as classic dependency inside `gts` / `gjs` file.

> Note: If you have `aliasing` / `babel` problems - add new `Addon` to `vite.config.ts` file (check samples in same file)

As we see, it's quite easy to redefine any part of addon, including component name, and it should be an easy way to fix possible breakage just overriding template / component with file from `src` folder.

If addon has more complex logic, we also have few samples:

1. If addon define new registry namespace, search for `ember-responsive`, `ember-intl` mentions in codebase.
1. If addon provide custom babel / handlebars plugins, search for `ember-ref-bucket`, `ember-concurrency` mentions in codebase.
1. If addon provide custom styles, search for `ember-bootstrap`, `ember-modal-dialog` mentions in codebase.

## Licence
[MIT](./LICENCE.md)
