import { Navigate, useLocation } from 'react-router-dom';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
