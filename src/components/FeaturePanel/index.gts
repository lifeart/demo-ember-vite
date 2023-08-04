import Component from '@glimmer/component';
interface FeaturePanelSignature {
  Blocks: {
    title: [],
    description: []
  };
}
export default class FeaturePanel extends Component<FeaturePanelSignature> {
  <template>
     <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        {{yield to="title"}}
      </h3>

      <div class="mt-2">
        {{yield to="description"}}
      </div>
    </div>
  </template>
}