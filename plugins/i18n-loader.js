import YAML from 'yaml';
import { readdir, access, readFile } from 'fs/promises';
import { basename, extname, join } from 'path';
import { constants } from 'fs';

const translationsFileName = 'ember-intl/translations';
const translationsDir = 'translations';

export default function i18nLoader() {
  return {
    name: 'i18n-loader',
    enforce: 'pre',

    resolveId(source) {
      if (source === translationsFileName) {
        return source;
      }

      return null;
    },

    async load(id) {
      if (id !== translationsFileName) {
        return null;
      }

      const translations = [];
      const files = await readdir(translationsDir);

      for (const file of files) {
        const extension = extname(file);

        if (extension !== '.yaml') {
          continue;
        }

        const filePath = join(translationsDir, file);

        try {
          await access(filePath, constants.R_OK);

          const content = await readFile(filePath, 'utf8');
          const json = YAML.parse(content);
          const lang = basename(file, extension);

          translations.push([lang, json]);
        } catch (e) {
          console.error(e);
        }
      }

      return `export default ${JSON.stringify(translations)}`;
    },
  };
}
