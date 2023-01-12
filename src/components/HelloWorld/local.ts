import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { registerComponent } from '../../config/utils';
export default registerComponent(class HelloWorld extends Component {
    onClick = () => alert('Fine');
    static template = precompileTemplate(`
        <h2 class="bg-white text-black">Local Component</h2>
        <div class="m-2">
        <Button {{on "click" this.onClick}}>Click Me</Button>
        </div>
    `)
});