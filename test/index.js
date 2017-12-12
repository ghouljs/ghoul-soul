const expect = require('expect');
const soul = require('../lib').default;
const middlewareAPI = require('../lib/_internal/middlewares').middlewareAPI;

const model = {
  namespace: 'app',
  state: 0,
  reducers: {
    '+'(state) {
      return state + 1;
    },
    '-'(state) {
      return state - 1;
    },
  },
  effects: {
    async '*+'(action, { dispatch }) {
      dispatch({ type: 'app@+' });
    },

    async 'throw'(action, { getComputes }) {
      const computes = getComputes();

      throw new Error(computes.app);
    },
  },
  computes: {
    'computes/app/state'({ getState }) {
      const { app } = getState();

      return app * 10;
    },
  },
  subscriptions: {
    setup({ getState }) {
      return getState().app * 10;
    },
  },
};

const app = soul();

describe('soul', () => {
  it('normal', () => {
    app.model(model);
    app.start();
  });

  it('namespace required', () => {
    expect(() => app.model({})).toThrow(/\[Model\] namespace should be defined./);
  });

  it('namespace duplicate', () => {
    expect(() => app.model(model)).toThrow(/\[Model\] namespace app has already been registered by other model./);
  });

  it('reducer normal', () => {
    app.dispatch({ type: 'app@+' });
    expect(app.getState()).toEqual({ app: 1 });

    app.dispatch({ type: 'app@-' });
    expect(app.getState()).toEqual({ app: 0 });
  });

  it('reducer type exclusive', () => {
    app.dispatch({ type: 'app@*' });

    expect(app.getState()).toEqual({ app: 0 });
  });

  it('effect normal', () => {
    app.dispatch({ type: 'app@*+' });

    expect(app.getState()).toEqual({ app: 1 });
  });

  it('compute normal', () => {
    const computes = app._api.getComputes();
    expect(computes.app['computes/app/state']()).toEqual(10);
  });

  it('subscription normal', () => {
    const subscriptions = app._api.getSubscriptions();
    expect(subscriptions.app.setup()).toEqual(10);
  })
});