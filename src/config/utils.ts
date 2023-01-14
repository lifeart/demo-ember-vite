import Ember from './ember';
import type Service from '@ember/service';
import type Controller from '@ember/controller';
import type Route from '@ember/routing/route';
import type GlimmerComponent from '@glimmer/component';
import type Helper from '@ember/component/helper';
import type Modifier from 'ember-modifier';
import { PrecompiledTemplate } from '@ember/template-compilation';

export type RegisteredComponent = typeof GlimmerComponent & { template: any };
export type RegistryType =
  | 'service'
  | 'controller'
  | 'route'
  | 'template'
  | 'component'
  | 'helper'
  | 'modifier';
export type RegistryKey = `${RegistryType}:${string}`;
export interface IRegistry {
  [key: RegistryKey]:
    | typeof Service
    | typeof Controller
    | typeof Route
    | typeof Helper
    | Modifier
    | RegisteredComponent
    | PrecompiledTemplate
    | Function;
}

export function registerComponent<T>(
  component: T & { template: any }
): RegisteredComponent {
  try {
    return Ember._setComponentTemplate(component.template, component);
  } catch (e) {
    console.error(e);
    return component as unknown as RegisteredComponent;
  }
}


export function extendRegistry(registry) {
  Object.keys(registry).forEach((key) => {
    window.MyApp.register(key, registry[key]);
  });
}