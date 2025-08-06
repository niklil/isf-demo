/**
 * Order Service
 * Handles order creation and bill splitting calculations
 */

import { PizzaType, OrderItem, Order, VALIDATION_RULES } from '../types/pizza';

export class OrderService {
  static validateQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Quantity must be a positive integer');
    }
    
    if (quantity > VALIDATION_RULES.maxQuantity) {
      throw new Error(`Quantity too large (max ${VALIDATION_RULES.maxQuantity})`);
    }
  }
  
  static validatePeopleCount(people: number): void {
    if (!Number.isInteger(people) || people < 1) {
      throw new Error('Number of people must be a positive integer');
    }
    
    if (people > VALIDATION_RULES.maxPeople) {
      throw new Error(`Too many people (max ${VALIDATION_RULES.maxPeople})`);
    }
  }
  
  static createOrderItem(pizza: PizzaType, quantity: number): OrderItem {
    this.validateQuantity(quantity);
    
    if (!pizza.available) {
      throw new Error(`Pizza '${pizza.name}' is not available`);
    }
    
    const subtotal = Math.round(pizza.price * quantity * 100) / 100;
    
    return {
      pizza,
      quantity,
      subtotal
    };
  }
  
  static calculateOrder(items: OrderItem[], peopleCount: number): Order {
    this.validatePeopleCount(peopleCount);
    
    if (items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const roundedTotal = Math.round(total * 100) / 100;
    
    // Calculate cost per person
    const costPerPerson = Math.round((roundedTotal / peopleCount) * 100) / 100;
    
    return {
      items,
      total: roundedTotal,
      peopleCount,
      costPerPerson
    };
  }
  
  static formatCurrency(amount: number): string {
    return `€${amount.toFixed(2)}`;
  }
  
  static getOrderSummary(order: Order): string {
    const itemsText = order.items.map(item => 
      `${item.quantity}x ${item.pizza.name} (${this.formatCurrency(item.subtotal)})`
    ).join(', ');
    
    return `Order: ${itemsText}. Total: ${this.formatCurrency(order.total)} for ${order.peopleCount} people = ${this.formatCurrency(order.costPerPerson)} per person.`;
  }
}
