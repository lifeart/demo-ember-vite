import Ember from './ember';
import type Service from '@ember/service';
import type Controller from '@ember/controller';
import type Route from '@ember/routing/route';
import type GlimmerComponent from '@glimmer/component';
import { PrecompiledTemplate } from '@ember/template-compilation';

export type RegisteredComponent = typeof GlimmerComponent & { template: any };
export type RegistryType = 'service' | 'controller' | 'route' | 'template' | 'component';
export type RegistryKey = `${RegistryType}:${string}`;
export interface IRegistry {
    [key: RegistryKey]: typeof Service | typeof Controller | typeof Route | RegisteredComponent | PrecompiledTemplate;
}

export function registerComponent<T>(component: T & { template: any }): RegisteredComponent {
    try {
        return Ember._setComponentTemplate(component.template, component);
    } catch (e) {
        console.error(e);
        return component as unknown as RegisteredComponent;
    }
}


