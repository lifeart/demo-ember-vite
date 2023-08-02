import Component from '@glimmer/component';

function add(a: number, b: number) {
    return a + b;
}

export default class MyComponent extends Component {
    <template>{{add 1 2}}</template>
}