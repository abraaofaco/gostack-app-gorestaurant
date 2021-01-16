import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  thumbnail_url: string;
  quantity: number;
  extras: Extra[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Food[]>([]);

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      try {
        const response = await api.get('/orders');

        const listOrders = response.data
          .map((food: Food) => ({
            ...food,
            formattedPrice: formattedTotal(food),
          }))
          .sort((a: Food, b: Food) => b.id - a.id);

        setOrders(listOrders);
      } catch (e) {
        console.log(e);
      }
    }

    loadOrders();
  }, []);

  function formattedTotal(food: Food): string {
    const totalExtra = food.extras.reduce(
      (acc, item) => acc + item.quantity * item.value,
      0,
    );

    return formatValue((totalExtra + food.price) * food.quantity);
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food key={item.id} activeOpacity={0.6}>
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Orders;
