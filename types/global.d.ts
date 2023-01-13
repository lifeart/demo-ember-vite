

declare module '@ember/template-compilation' {
  export default function <T>(component: T): T;
}

declare module '*.hbs' {
  import { TemplateOnlyComponent } from '@glimmer/runtime';
  export default TemplateOnlyComponent;
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
