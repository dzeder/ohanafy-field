import { Q } from '@nozbe/watermelondb';
import { useEffect, useState } from 'react';

import { database } from '@/db';
import type { Order } from '@/db/models/Order';
import type { OrderLine } from '@/db/models/OrderLine';
import type { Product } from '@/db/models/Product';

export interface OrderState {
  order: Order | null;
  lines: OrderLine[];
  products: Product[];
  loading: boolean;
}

export function useOrder(orderId: string | undefined): OrderState {
  const [state, setState] = useState<OrderState>({
    order: null,
    lines: [],
    products: [],
    loading: true,
  });

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    const orderObs = database.get<Order>('orders').findAndObserve(orderId);
    const linesObs = database
      .get<OrderLine>('order_lines')
      .query(Q.where('order_id', orderId))
      .observe();
    const productsObs = database
      .get<Product>('products')
      .query(Q.where('is_active', true), Q.sortBy('name', Q.asc))
      .observe();

    let order: Order | null = null;
    let lines: OrderLine[] = [];
    let products: Product[] = [];

    const subOrder = orderObs.subscribe((o) => {
      order = o;
      if (active) setState({ order, lines, products, loading: false });
    });
    const subLines = linesObs.subscribe((ls) => {
      lines = ls;
      if (active) setState({ order, lines, products, loading: false });
    });
    const subProducts = productsObs.subscribe((ps) => {
      products = ps;
      if (active) setState({ order, lines, products, loading: false });
    });

    return () => {
      active = false;
      subOrder.unsubscribe();
      subLines.unsubscribe();
      subProducts.unsubscribe();
    };
  }, [orderId]);

  return state;
}
