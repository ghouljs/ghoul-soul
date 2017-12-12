import { Subscription, APIs } from '../types';
// import { MODEL_SEPERATOR } from './utils';

import { dispatch, getState } from './middlewares';

export const subscriptions: Subscription = {};

function wrapSubscriptions(namespace: string, subscriptions: Subscription, apis?: APIs): Subscription {
  return Object
    .keys(subscriptions)
    .reduce(
      (lastValue, nextKey) => ({
        ...lastValue,
        [`${nextKey}`]: function () { // ${namespace}${MODEL_SEPERATOR}${nextKey}
          return (subscriptions[nextKey] as any).call(null, { ...apis, dispatch, getState });
        },
      }),
      {},
    );
}

export function addSubscriptions(namespace: string, _subscriptions?: Subscription, apis?: APIs) {
  if (undefined === _subscriptions) return false;

  subscriptions[namespace] = wrapSubscriptions(namespace, _subscriptions, apis);
}

export function getSubscriptions() {
  return subscriptions;
}

export function runSubscriptions() {
  for (const namespace in subscriptions) {
    Object
      .keys(subscriptions[namespace])
      .forEach((key: string) => subscriptions[namespace][key].call(null));
  }
}