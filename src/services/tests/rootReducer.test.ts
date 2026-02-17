import { rootReducer } from '../rootReducer';
import { configureStore } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('должен правильно инициализироваться', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('orders');
  });
});
