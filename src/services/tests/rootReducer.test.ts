import { rootReducer } from '../rootReducer';
import constructorReducer from '../slices/constructorSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import orderReducer from '../slices/orderSlice';
import userReducer from '../slices/userSlice';
import feedReducer from '../slices/feedSlice';
import ordersReducer from '../slices/ordersSlice';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.burgerConstructor).toEqual(constructorReducer(undefined, { type: '@@INIT' }));
    expect(state.ingredients).toEqual(ingredientsReducer(undefined, { type: '@@INIT' }));
    expect(state.order).toEqual(orderReducer(undefined, { type: '@@INIT' }));
    expect(state.user).toEqual(userReducer(undefined, { type: '@@INIT' }));
    expect(state.feed).toEqual(feedReducer(undefined, { type: '@@INIT' }));
    expect(state.orders).toEqual(ordersReducer(undefined, { type: '@@INIT' }));
  });

  it('должен возвращать то же состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const state = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });
});
