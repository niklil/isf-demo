/**
 * Pizza Management System Types
 * TypeScript interfaces for the pizza management system
 */

export interface PizzaType {
  id: number;
  name: string;
  price: number;
  available: boolean;
}

export interface OrderItem {
  pizza: PizzaType;
  quantity: number;
  subtotal: number;
}

export interface Order {
  items: OrderItem[];
  total: number;
  peopleCount: number;
  costPerPerson: number;
}

export interface PizzaValidationRules {
  maxNameLength: number;
  maxPizzaTypes: number;
  maxPrice: number;
  minPrice: number;
  maxQuantity: number;
  maxPeople: number;
}

export const VALIDATION_RULES: PizzaValidationRules = {
  maxNameLength: 50,
  maxPizzaTypes: 20,
  maxPrice: 999.99,
  minPrice: 0.01,
  maxQuantity: 1000,
  maxPeople: 1000
};

export enum ViewMode {
  MENU_MANAGEMENT = 'menu',
  ORDER_CREATION = 'order',
  BILL_SPLIT = 'split'
}
