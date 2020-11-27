import { derived } from 'svelte/store';

import auditStore from '../auditStore.js';
import wcag from '../wcagStore.js';

import { TestRequirement } from './models.js';

/**
 * Lookup dictionairy for tests
 * {
 *  [locale]: {
 *    [version]: [
 *      {
 *        ID: '#.#.#',
 *        title: '…',
 *        description: '…',
 *        details: [
 *          {
 *            title: '…',
 *            description: '…'
 *          }
 *        ]
 *      }
 *    ]
 *  }
 * }
 * @type {Object}
 */
const _tests = {};

const $tests = derived([auditStore], () => lookupTests);

function lookupTests(wcagVersion) {
  if (_tests[wcagVersion]) {
    return _tests[wcagVersion];
  }

  return createTests(wcagVersion);
}

function createTests(wcagVersion) {
  _tests[wcagVersion] = wcag[wcagVersion].map((criterion) => {
    const test = new TestRequirement();

    // Extend with wcag specific props
    Object.assign(test, {
      num: criterion.num,
      conformanceLevel: criterion.conformanceLevel
    });

    return test;
  });

  return _tests[wcagVersion];
}

export default $tests;
