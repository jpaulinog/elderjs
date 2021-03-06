/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import path from 'path';
import fs from 'fs';

import { ExternalHelperRequestOptions } from './utils/types';

let userHelpers;

const cache = {};

async function externalHelpers({ settings, query, helpers }: ExternalHelperRequestOptions) {
  const srcFolder = path.join(process.cwd(), settings.locations.srcFolder);
  const buildFolder = path.join(process.cwd(), settings.locations.buildFolder);
  const helperFilePath = `helpers/index.js`;

  const srcHelpers = path.join(srcFolder, helperFilePath);
  const buildHelpers = path.join(buildFolder, helperFilePath);
  if (!cache[helperFilePath]) {
    try {
      fs.statSync(srcHelpers);
      userHelpers = require(srcHelpers);

      if (typeof userHelpers === 'function') {
        userHelpers = await userHelpers({ settings, query, helpers });
      }
      cache[helperFilePath] = userHelpers;
    } catch (err) {
      if (settings.locations.buildFolder && settings.locations.buildFolder.length > 0) {
        try {
          fs.statSync(buildHelpers);
          userHelpers = require(buildHelpers);
          if (typeof userHelpers === 'function') {
            userHelpers = await userHelpers({ settings, query, helpers });
          }
          cache[helperFilePath] = userHelpers;
        } catch (e) {
          console.error(e);
        }
      }

      if (err.code === 'ENOENT') {
        if (settings.debug.automagic) {
          console.log(
            `debug.automagic:: We attempted to automatically add in helpers, but we couldn't find the file at ${srcHelpers}.`,
          );
        }
      }
    }
  } else {
    userHelpers = cache[helperFilePath];
  }

  if (userHelpers && Object.keys(userHelpers).length > 0) {
    if (settings.debug.automagic) {
      console.log(`debug.automagic:: We're add in helpers to the helpers object from the file at: ${helperFilePath}.`);
    }
  }

  return userHelpers;
}

export default externalHelpers;
