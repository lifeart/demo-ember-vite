import EmberPageTitleService from 'ember-page-title/addon/services/page-title';
import EmberPageTitleListService from 'ember-page-title/addon/services/page-title-list';
import EmberPageTitleHelper from 'ember-page-title/addon/helpers/page-title';

const registry = {
  'helper:page-title': EmberPageTitleHelper,
  'service:page-title': EmberPageTitleService,
  'service:page-title-list': EmberPageTitleListService,
};

export default registry;
