import ordersReducer, { fetchUserOrders } from '../ordersSlice';

describe('ordersSlice', () => {
  const initialState = {
    orders: [],
    loading: false
  };

  const mockOrders = [{
    _id: 'order-1',
    status: 'done',
    name: 'Заказ 1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 1,
    ingredients: ['ing-1']
  }];

  it('должен возвращать начальное состояние', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен устанавливать loading в true при pending', () => {
    const action = { type: fetchUserOrders.pending.type };
    const actual = ordersReducer(initialState, action);
    expect(actual.loading).toBe(true);
  });

  it('должен сохранять заказы при fulfilled', () => {
    const action = { type: fetchUserOrders.fulfilled.type, payload: mockOrders };
    const actual = ordersReducer(initialState, action);
    expect(actual.loading).toBe(false);
    expect(actual.orders).toEqual(mockOrders);
  });

  it('должен устанавливать loading в false при rejected', () => {
    const action = { type: fetchUserOrders.rejected.type };
    const actual = ordersReducer(initialState, action);
    expect(actual.loading).toBe(false);
  });
});
