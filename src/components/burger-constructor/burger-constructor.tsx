import { FC, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, resetOrder } from '../../services/slices/orderSlice'; // Добавляем resetOrder
import { clearConstructor } from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);
  const user = useSelector((state) => state.user.user);

  const onOrderClick = useCallback(() => {
    const accessToken = getCookie('accessToken');

    if (!accessToken || !user) {
      localStorage.setItem(
        'burgerConstructor',
        JSON.stringify(constructorItems)
      );
      navigate('/login', {
        state: { from: '/' }
      });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds)).then(() => {
      dispatch(clearConstructor());
    });
  }, [constructorItems, orderRequest, user, dispatch, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(resetOrder());
  }, [dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
