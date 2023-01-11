import ENV from "./env";
import registry from "./registry";

export function init(application) {
    const MyApp = application.create({
        "name": ENV.modulePrefix,
        "version": "0.0.0+33d058ab"
    });


    const registryObjects = registry();

    Object.keys(registryObjects).forEach((key) => {
        console.log(registryObjects[key].toString());
        MyApp.register(key, registryObjects[key]);
    });

    return MyApp;
}