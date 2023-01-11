import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { registerComponent } from '../../config/registry';
export default registerComponent(class HelloWorld extends Component {
    static template = precompileTemplate(`
        <h2>Local Component</h2>
    `)
})