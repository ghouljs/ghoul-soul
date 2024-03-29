import { MODELSInterface, Model } from '../types';

import { addReducers } from './reducers';
import { addEffects, getEffects } from './effects';
import { addState } from './state';
import { addComputes, getComputes } from './computes';
import { addSubscriptions } from './subscriptions';

// import { collectState } from './state';
// import { collectReducers } from './reducers';
// import { collectEffects } from './effects';

// const namespaces = [];
// const state = {};
// const reducers = {};
// const effects = {};
// const computes = {};
// const subscriptions = {};

// function collectRedux(): { state: State, reducers: Reducer } {
//   const state = collectState(models);
//   const reducers = collectReducers(models);
//   const effects = collectEffects(models);

//   return { state, reducers: { ...reducers, ...effects } };
// }

const DEFAULT_MODEL_TEMPLATE = {
  namespace: '',
  state: undefined,
  reducers: undefined,
  effects: undefined,
  computes: undefined,
  subscriptions: undefined
};
const models: MODELSInterface = {};

export function addModel(model: Model = DEFAULT_MODEL_TEMPLATE) {
  const namespace = model.namespace;

  if (undefined === namespace) {
    throw new Error(`[Model] namespace should be defined.`);
  }

  if (Object.prototype.hasOwnProperty.call(models, namespace)) {
    throw new Error(`[Model] namespace ${namespace} has already been registered by other model.`);
  };

  models[namespace] = model;

  addState(namespace, model.state);
  addReducers(namespace, model.reducers);
  addEffects(namespace, model.effects, { getEffects, getComputes });
  //
  addComputes(namespace, model.computes);
  addSubscriptions(namespace, model.subscriptions, { getEffects, getComputes });
}

export function getModels() {
  return models;
}