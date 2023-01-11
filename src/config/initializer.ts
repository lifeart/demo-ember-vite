import ENV from "./env";
import registry from "./registry";
import type ApplicationInstance from '@ember/application/instance';

export function init(application: ApplicationInstance, router: any) {
    const MyApp = application.create({
        "name": ENV.modulePrefix,
        "version": "0.0.0+33d058ab"
    });


    const registryObjects = registry();
    console.table(registryObjects);
    
    Object.keys(registryObjects).forEach((key) => {
        MyApp.register(key, registryObjects[key]);
    });

    MyApp.register('router:main', router);

    return MyApp;
}