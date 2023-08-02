import Component from '@glimmer/component';
import Button from '@/components/Button';

function add(a: number, b: number) {
    return a + b;
}

export default class MyComponent extends Component {
    <template><Button>{{add 1 2}}</Button></template>
}