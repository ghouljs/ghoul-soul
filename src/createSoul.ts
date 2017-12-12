import { Store } from 'redux';
import { Options } from './types';
import { warning } from './_internal/utils';

import { addModel, getModels } from './_internal/model';
import { getStates } from './_internal/state';
import { getReducers } from './_internal/reducers';
import { getEffects } from './_internal/effects';
import { getComputes } from './_internal/computes';
import { getSubscriptions, runSubscriptions } from './_internal/subscriptions';

import createStore from './utils/createStore';

const DEFAULT_OPTIONS = {
  plugins: {},
};

export default function createSoul(options: Options = DEFAULT_OPTIONS) {
  return {
    model: addModel,

    dispatch: warning,
    getState: warning,
    subscribe: warning,

    _api: {
      getModels,
      getStates,
      getReducers,
      getEffects,
      getComputes,
      getSubscriptions,
    },

    _store: null,

    start: function () {
      const initialState = getStates();
      const reducers = getReducers();
    
      const store: Store<any> = createStore(reducers, initialState, options.plugins || {});

      // run sunscriptions
      runSubscriptions();
    
      this.dispatch = store.dispatch;
      this.getState = store.getState;
      this.subscribe = store.subscribe;

      this._store = store;

      return this;
    },
  };
}