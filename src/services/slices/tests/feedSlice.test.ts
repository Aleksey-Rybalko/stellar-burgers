import feedReducer, { fetchFeeds } from '../feedSlice';

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
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
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен устанавливать loading в true при pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const actual = feedReducer(initialState, action);
    expect(actual.loading).toBe(true);
  });

  it('должен сохранять данные при fulfilled', () => {
    const action = { 
      type: fetchFeeds.fulfilled.type, 
      payload: { orders: mockOrders, total: 100, totalToday: 10 }
    };
    const actual = feedReducer(initialState, action);
    expect(actual.loading).toBe(false);
    expect(actual.orders).toEqual(mockOrders);
    expect(actual.total).toBe(100);
    expect(actual.totalToday).toBe(10);
  });

  it('должен устанавливать loading в false при rejected', () => {
    const action = { type: fetchFeeds.rejected.type };
    const actual = feedReducer(initialState, action);
    expect(actual.loading).toBe(false);
  });
});
