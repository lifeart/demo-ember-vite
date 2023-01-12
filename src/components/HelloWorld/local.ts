import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { registerComponent } from '../../config/utils';


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
  

    For local (scoped) components, we need to call `registerComponent` here, to setComponentTemplate.

    If you want to use it in global namespace, 
        you need to register it in src/config/registry.ts and remove registerComponent call here

*/

export default registerComponent(class HelloWorld extends Component {
    onClick = () => alert('Fine');
    static template = precompileTemplate(`
        <h2 class="bg-white text-black">Local Component</h2>
        <div class="m-2">
        <Button {{on "click" this.onClick}}>Click Me</Button>
        </div>
    `)
});