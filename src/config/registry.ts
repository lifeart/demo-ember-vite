/* imported routes */
import { ApplicationRoute } from '../routes/application';
// import { MainRoute } from '../routes/main';

/* imported controllers */
import { ApplicationController } from '../controllers/application';

/* imported templates */
import ApplicationTemplate from '../templates/application';
import AboutTemplate from '../templates/about';

/* imported services */
import DateService from '../services/date';

/* imported components */
import HelloWorld from '../components/HelloWorld';
import Button from '../components/Button';

/* imported helpers */
import MemoryUsage from '../helpers/memory-usage';

import { IRegistry } from './utils';


function registry(): IRegistry {
    return {
        'service:date': DateService,
        'controller:application': ApplicationController,
        'route:application': ApplicationRoute,
        'template:application': ApplicationTemplate,
        'template:about': AboutTemplate,
        'component:hello-world': HelloWorld,
        'component:button': Button,
        'helper:memory-usage': MemoryUsage,
    };
}

export default registry;
