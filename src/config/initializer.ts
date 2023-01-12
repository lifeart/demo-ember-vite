import ENV from "./env";
import registry from "./registry";
import type Application from '@ember/application';
import { registerComponent } from "./utils";

export function init(application: Application, router: any) {
    const MyApp = application.create({
        "name": ENV.modulePrefix,
        "version": "0.0.0+33d058ab"
    });
    

    const registryObjects = registry();
    console.table(registryObjects);
    
    Object.keys(registryObjects).forEach((key) => {
        const value = registryObjects[key];
        if (key.startsWith('component:')) {
            MyApp.register(key, registerComponent(value));
        } else {
            MyApp.register(key, value);
        }
    });

    MyApp.register('router:main', router);

    return MyApp;
}