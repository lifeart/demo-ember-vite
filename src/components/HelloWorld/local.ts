import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';

/* 
    This is sample of local component, which is not registered in global namespace

    To use it, we need:
    
        .1 Import component 
        .2 Put it into template
        .3 Tell glimmer to use strict mode and specify scope
    
    ```js
        import Local from './local'; 
        import { precompileTemplate } from '@ember/template-compilation';
        import Component from '@glimmer/component';        
    
        export default class HelloWorld extends Component {
            static template = precompileTemplate(`
                <Local />
            `, { scope: () => ({ Local }), isStrictMode: true });
        }
    ```

*/

export default class HelloWorld extends Component {
    onClick = () => alert('Fine');
    static template = precompileTemplate(`
        <h2 class="bg-white text-black" {{click-tracker}}>Local Component</h2>
        <div class="m-2">
        <Button {{on "click" this.onClick}}>Click Me</Button>
        </div>
    `)
};