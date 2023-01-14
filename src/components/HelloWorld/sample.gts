import Component from '@glimmer/component';

function add() {
    return 1 + 1;
}

export default class MyComponent extends Component {
    <template>{{add}}</template>
}