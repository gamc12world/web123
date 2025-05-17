import { supabase } from './supabase';
import { Product, Order, CartItem, User } from '../types';

// User functions
export const createUserProfile = async (user: User) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.isAdmin
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Order functions
export const createOrder = async (order: Order) => {
  // First create the order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{
      id: order.id,
      user_id: order.userId,
      total: order.total,
      status: order.status,
      shipping_address: order.shippingAddress,
      payment_method: order.paymentMethod,
      created_at: order.createdAt
    }])
    .select()
    .single();

  if (orderError) throw orderError;

  // Then create order items
  const orderItems = order.items.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.product.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return orderData;
};

export const getOrdersByUserId = async (userId: string) => {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId);

  if (ordersError) throw ordersError;

  // Transform the data to match our Order type
  return orders.map(order => ({
    id: order.id,
    userId: order.user_id,
    total: order.total,
    status: order.status,
    shippingAddress: order.shipping_address,
    paymentMethod: order.payment_method,
    createdAt: new Date(order.created_at),
    items: order.order_items.map((item: any) => ({
      product: {
        id: item.product_id,
        // We'll need to fetch product details separately
        name: '',
        price: item.price,
        description: '',
        category: 'men',
        imageUrl: '',
        sizes: [],
        colors: [],
        inStock: true
      },
      quantity: item.quantity,
      size: item.size,
      color: item.color
    }))
  }));
};

export const getOrderById = async (orderId: string) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId)
    .single();

  if (orderError) throw orderError;

  return {
    id: order.id,
    userId: order.user_id,
    total: order.total,
    status: order.status,
    shippingAddress: order.shipping_address,
    paymentMethod: order.payment_method,
    createdAt: new Date(order.created_at),
    items: order.order_items.map((item: any) => ({
      product: {
        id: item.product_id,
        name: '',
        price: item.price,
        description: '',
        category: 'men',
        imageUrl: '',
        sizes: [],
        colors: [],
        inStock: true
      },
      quantity: item.quantity,
      size: item.size,
      color: item.color
    }))
  };
};