import 'ember-source/types';
import 'ember-source/types/preview';
import { InitialRegistry as AppRegistry } from '@/config/registry';
import AddonsRegistry from '@/addons';
import EmberBootstrapRegistry from '@/addons/ember-bootstrap';
import type {
  Filter,
  CamelizeName,
  ReFilterObject,
  Mapped,
  FilterObject,
  ReverseMap,
} from './helpers';
import type Ember from 'ember';
import type env from '@/config/env';
import type Application from '@ember/application';
import { ComponentManager, ComponentCapabilities } from '@glimmer/core';

type Ember = typeof Ember;
type InitialRegistry = typeof AppRegistry &
  typeof AddonsRegistry &
  typeof EmberBootstrapRegistry;
type Services = Filter<keyof InitialRegistry, 'service'>;
type Components = Filter<keyof InitialRegistry, 'component'>;
type Controllers = Filter<keyof InitialRegistry, 'controller'>;
type Helpers = Filter<keyof InitialRegistry, 'helper'>;
type Modifiers = Filter<keyof InitialRegistry, 'modifier'>;
type SnakedComponents = CamelizeName<Components>;

declare module '@ember/controller' {
  type ControllersObject = FilterObject<
    InitialRegistry,
    'controller',
    Controllers
  >;

  interface Registry extends ControllersObject {
    '--[sample]--': unknown;
  }
}

declare module '@ember/service' {
  type ServicesObject = FilterObject<InitialRegistry, 'service', Services>;

  interface Registry extends ServicesObject {
    '--[sample]--': unknown;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  // need to figure out how to map this keys to registry;
  type MappedComponents = Mapped<Components>;
  type ReMappedComponents = ReverseMap<MappedComponents>;
  type CamelizedComponentsObject = ReFilterObject<
    InitialRegistry,
    'component',
    ReMappedComponents
  >;
  type HelpersObject = FilterObject<InitialRegistry, 'helper', Helpers>;
  type ComponentsObject = FilterObject<
    InitialRegistry,
    'component',
    Components
  >;
  type ModifiersObject = FilterObject<InitialRegistry, 'modifier', Modifiers>;

  type _Registry = HelpersObject &
    ComponentsObject &
    ModifiersObject &
    CamelizedComponentsObject;

  export default interface Registry extends _Registry {
    '--[sample]--': unknown;
  }
}

declare module '@ember/template-compilation' {
  export default function <T>(component: T): T;
}

declare module '*.hbs' {
  import { TemplateOnlyComponent } from '@glimmer/runtime';
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  export default TemplateOnlyComponent && TemplateFactory;
}

declare module '@ember/template-compilation' {
  export type PrecompiledTemplate = () => unknown & { id: string };
  export function precompileTemplate(
    template: string,
    options?: {
      isStrictMode?: boolean;
      scope: () => Record<string, unknown>;
    }
  ): PrecompiledTemplate;
}

declare module 'ember-component-manager' {
  export default class extends ComponentManager {
    capabilities: ComponentCapabilities;
  }
}

declare module '@ember/destroyable' {
  export function registerDestructor<T extends object>(
    destroyable: T,
    destructor: (destroyable: T) => void
  ): (destroyable: T) => void {
    return _registerDestructor(destroyable, destructor);
  }

  export function unregisterDestructor<T extends object>(
    destroyable: T,
    destructor: (destroyable: T) => void
  ): void {
    return _unregisterDestructor(destroyable, destructor);
  }
}

declare global {
  interface Window {
    _Ember: Ember;
    Ember: Ember;
    [env.APP.globalName]: Application;
    EmberENV: Record<string, boolean | Record<string, unknown>>;
  }

  interface Performance {
    memory?: {
      /** The maximum size of the heap, in bytes, that is available to the context. */
      jsHeapSizeLimit: number;
      /** The total allocated heap size, in bytes. */
      totalJSHeapSize: number;
      /** The currently active segment of JS heap, in bytes. */
      usedJSHeapSize: number;
    };
  }
}
