## Ember + Vite

---

This is sample Ember application running only on `Vite`, without `ember-cli` and `embroider`.

* It's `TypeScript`'ed by default.
* It uses `vite` to build the app.
* `tailwind` used for styling.


Main difference with classic Ember application, is that we don't trying to automatically resolve addons and it's dependencies - we just import them directly, only once needed.

---

### Key supported features

1. Strict mode
1. Lazy-loading for routes
1. Template-only components
1. Style imports from components
1. Ember Inspector
1. Template imports support (`.gts` & `.gjs`)
1. Glint support
1. Testing support (QUnit)

### Unsupported

1. `ember-data` not supported yet
1. no waiters support in tests (yet)


### In scope of this app we able to run this addons

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

[(see code for samples)](https://github.com/lifeart/demo-ember-vite/tree/master/src/addons)


*This is not complete list, and you could add `any` ember addon you want (if it don't have `ember-cli` logic)*

---

PR's are welcome.

---

To check app, run:

```bash
yarn install
yarn dev
```

---


## Why?

I would like to bulletproof opinion, that modern ember application could be statically resolvable by default, and I would like to use `Vite` for that. It give as ability to use `TypeScript` and `ESM` by default, and it's very fast.

## Disclaimer

I'm not planning to actively maintain this repo, but if you have any questions, feel free to ask.
