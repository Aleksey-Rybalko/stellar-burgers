import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { loginUser, clearError } from '../../services/slices/userSlice';
import { restoreConstructor } from '../../services/slices/constructorSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, error, isLoading } = useSelector((state) => state.user);
  const from = location.state?.from || '/';

  // Очищаем ошибки при загрузке компонента
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Обработка успешного входа
  useEffect(() => {
    if (user) {
      console.log('✅ Пользователь авторизован, обрабатываю редирект...');

      // Восстанавливаем конструктор бургера из localStorage
      const savedConstructor = localStorage.getItem('burgerConstructor');
      if (savedConstructor) {
        try {
          const parsedConstructor = JSON.parse(savedConstructor);
          dispatch(restoreConstructor(parsedConstructor));
        } catch (e) {
          console.error('Ошибка восстановления конструктора:', e);
        }
        localStorage.removeItem('burgerConstructor');
      }

      // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Восстанавливаем ПОЛНОЕ состояние из protectedRouteRedirect
      const savedRedirect = sessionStorage.getItem('protectedRouteRedirect');

      if (savedRedirect) {
        try {
          const redirectData = JSON.parse(savedRedirect);
          console.log('🔄 Найден сохраненный редирект:', redirectData);
          console.log('📦 Состояние для восстановления:', redirectData.state);

          // Очищаем storage
          sessionStorage.removeItem('protectedRouteRedirect');

          // Если был background в state - сохраняем его отдельно для модалки
          if (redirectData.state?.background) {
            console.log('🎯 Обнаружен background, сохраняю для модалки');
            sessionStorage.setItem(
              'modalBackground',
              JSON.stringify(redirectData.state.background)
            );
          }

          // Редирект на исходный путь с ПОЛНЫМ восстановленным состоянием
          console.log(
            '🔄 Редирект на:',
            redirectData.path,
            'со state:',
            redirectData.state
          );
          navigate(redirectData.path, {
            replace: true,
            state: redirectData.state // ← Восстанавливаем ВСЁ состояние
          });
          return;
        } catch (e) {
          console.error('❌ Ошибка восстановления редиректа:', e);
          sessionStorage.removeItem('protectedRouteRedirect');
        }
      }

      // Если нет сохраненного редиректа - обычный редирект
      console.log('🔄 Обычный редирект на:', from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from, dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Простая валидация
    if (!email || !password) {
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
