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

  // Проверяем авторизацию при первом рендере
  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  // Пока проверяем авторизацию, показываем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  // Если маршрут только для неавторизованных, а пользователь авторизован
  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace state={location.state} />;
  }

  // Если маршрут требует авторизации, а пользователь не авторизован
  if (!onlyUnAuth && !user) {
    // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Сохраняем ВСЕ состояние location
    const redirectData = {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state // ← Сохраняем ВЕСЬ state, включая background!
    };

    console.log('🔒 ProtectedRoute: Сохраняю редирект данные:', redirectData);

    sessionStorage.setItem(
      'protectedRouteRedirect',
      JSON.stringify(redirectData)
    );

    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Все проверки пройдены, показываем дочерний компонент
  return <>{children}</>;
};
