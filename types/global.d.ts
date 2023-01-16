import { InitialRegistry } from '@/config/registry';

declare module '@glint/environment-ember-loose/registry' {
  type DashToCamelCase<S extends string> = S extends `${infer T}-${infer U}`
    ? `${Capitalize<T>}${Capitalize<DashToCamelCase<U>>}`
    : S;
  type Spilt<S extends string> = S extends `${infer T}/${infer U}`
    ? `${T}::${Capitalize<U>}`
    : S;
  type Filter<T, P> = T extends `${P}:${infer D extends string}` ? D : never;

  type InitialRegistry = typeof InitialRegistry;
  // type Services = Filter<keyof InitialRegistry, 'service'>;
  type Components = Filter<keyof InitialRegistry, 'component'>;
  type Helpers = Filter<keyof InitialRegistry, 'helper'>;
  type Modifiers = Filter<keyof InitialRegistry, 'modifier'>;
  type SnakedComponents = Capitalize<Spilt<DashToCamelCase<Components>>>;

  type Mapped<K> = {
    [P in K]: Capitalize<Spilt<DashToCamelCase<P>>>;
  };

  type ValueOf<T> = T[keyof T];

  type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
      [K in keyof T]: T[K] extends P ? K : never;
    }[keyof T];
  };
  // need to figure out how to map this keys to registry;
  type MappedComponents = Mapped<Components>;
  type ReMappedComponents = ReverseMap<MappedComponents>;

  type FilterObject<T, P, R> = {
    [K in R]: T[`${P}:${K}`];
  };

  type ReFilterObject<T, P, R> = {
    [K in keyof R]: T[`${P}:${R[K]}`];
  };

  type CamelizedComponentsObject = ReFilterObject<
    InitialRegistry,
    'component',
    ReMappedComponents
  >;
  type HelpersObject = FilterObject<InitialRegistry, 'helper', Helpers>;
  // type ServicesObject = FilterObject<InitialRegistry, 'service', Services>;
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
  export type PrecompiledTemplate = Function & { id: string };
  export function precompileTemplate(
    template: string,
    options?: any
  ): PrecompiledTemplate;
}

declare module 'ember-component-manager' {
  export default class extends ComponentManager {
    capabilities: any;
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
