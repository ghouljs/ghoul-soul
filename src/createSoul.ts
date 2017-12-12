import { Store } from 'redux';
import { Options } from './types';
import { addModel, getModels } from './_internal/model';
import { getStates } from './_internal/state';
import { getReducers } from './_internal/reducers';
import { getEffects } from './_internal/effects';
import { getComputes } from './_internal/computes';
import { getSubscriptions, runSubscriptions } from './_internal/subscriptions';

import createStore from './utils/createStore';

let store: Store<any>;

const DEFAULT_OPTIONS = {
  plugins: {},
};

export default function createSoul(options: Options = DEFAULT_OPTIONS) {
  return {
    model: addModel,

    dispatch: (store || {}).dispatch,
    getState: (store || {}).getState,

    _api: {
      getModels,
      getStates,
      getReducers,
      getEffects,
      getComputes,
      getSubscriptions,
    },

    _store: store,

    start: function () {
      const initialState = getStates();
      const reducers = getReducers();
    
      store = createStore(reducers, initialState, options.plugins || {});

      // run sunscriptions
      runSubscriptions();
    
      this.dispatch = store.dispatch;
      this.getState = store.getState;
      this._store = store;

      return this;
    },
  };
}