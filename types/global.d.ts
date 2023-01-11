declare module '@ember/template-compilation' {
    export default function<T>(component: T): T;
}

declare module '@ember/template-compilation' {
    export function precompileTemplate(template: string, options?: any): any;
}

declare module 'ember-component-manager' {
    export default class extends ComponentManager {
        capabilities: any;
    }
}
