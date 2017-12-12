import { MiddlewareAPI, Action, Dispatch, GetState } from '../types';

import { warning } from './utils';
import { effects } from './effects';
import { getComputes } from './computes';

export let dispatch: Dispatch = warning;
export let getState: GetState = warning;

export const middlewareAPI: MiddlewareAPI = {
  dispatch: warning,
  getState: warning,
};

export function createMiddleware(hook = (middlewareAPI: MiddlewareAPI) => null) {
  return (middlewareAPIs: MiddlewareAPI) => {
    dispatch = middlewareAPI.dispatch = middlewareAPIs.dispatch;
    getState = middlewareAPI.getState = middlewareAPIs.getState;

    hook({ dispatch, getState });

    return (next: Dispatch) => (action: Action) => {
      let result = next(action);

      if (typeof effects[action.type] === 'function') {
        result = effects[action.type](action, { dispatch, getState, getComputes });
      }
  
      return result;
    };
  };
}