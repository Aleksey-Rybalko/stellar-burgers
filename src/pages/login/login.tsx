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

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
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

      navigate(from, { replace: true });
    }
  }, [user, navigate, from, dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

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
