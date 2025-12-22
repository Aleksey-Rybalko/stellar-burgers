import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);
  const total = useSelector((state) => state.feed.total);
  const totalToday = useSelector((state) => state.feed.totalToday);
  const loading = useSelector((state) => state.feed.loading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (loading && orders.length === 0) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
