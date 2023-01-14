import Component from '@glimmer/component';
import Ember from 'ember';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { precompileTemplate } from '@ember/template-compilation';
import { ARGS_SET } from '@glimmer/component';
import { setComponentTemplate } from '@glimmer/manager';
import { DEBUG } from '@glimmer/env';

class ReactComponent extends Component {
  constructor(owner: any, args: any, app: any) {
    super(owner, args);
    this.app = app;
  }
  id = `r-${Math.random().toString(36).substr(2, 9)}`;
  root: any;
  app: any;
  get node() {
    return document.querySelector(`div[data-id="${this.id}"]`);
  }
  renderReact = () => {
    if (this.root) {
        this.root.unmount();
        this.root = null;
    }
    const root = this.root || createRoot(this.node);
    root.render(
      React.createElement(React.Fragment, {}, wrapper(this.args.named, this.app))
    );
    this.root = root;
  };
  willDestroy(): void {
    this.root.unmount();
  }
}
const seenComponents = new WeakSet();

export function r(component: any) {
    if (seenComponents.has(component)) {
        return component;
    }
    if (!seenComponents.has(component)) {
        seenComponents.add(component);
    }

    Ember._setComponentManager((owner: any) => {
        return {
          capabilities: Ember._componentManagerCapabilities('3.13'),
          createComponent(factory: any, args: any) {
            if (DEBUG) {
                ARGS_SET.set(args, true);
            }
            return new ReactComponent(owner, args, factory);
          },
          getContext(component: any) {
            return component;
          },
        };
      }, component);

  return setComponentTemplate(
    precompileTemplate(`
        <div data-id={{this.id}}></div>
        {{this.renderReact}}
    `),
    component
  );
}

export const wrapper = (props, App) => {
    return (
        <App {...props} />
    );
}


