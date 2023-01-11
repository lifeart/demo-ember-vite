import { ApplicationController } from '../controllers/application';
import { ApplicationRoute } from '../routes/application';
import ApplicationTemplate from '../templates/application';

import HelloWorld from '../components/HelloWorld';

function registry() {
    return {
        'controller:application': ApplicationController,
        'route:application': ApplicationRoute,
        'template:application': ApplicationTemplate(),
        'template:components/hello-world': window.compile(HelloWorld.template),
        'component:hello-world': HelloWorld,
    };
}

export default registry;