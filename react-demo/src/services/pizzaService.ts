/**
 * Pizza Menu Service
 * Handles pizza menu operations with local storage persistence
 */

import { PizzaType, VALIDATION_RULES } from '../types/pizza';

export class PizzaMenuService {
  private static readonly STORAGE_KEY = 'pizza-menu';
  
  private static validateName(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new Error('Pizza name must be a non-empty string');
    }
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Pizza name cannot be empty');
    }
    
    if (trimmedName.length > VALIDATION_RULES.maxNameLength) {
      throw new Error(`Pizza name too long (max ${VALIDATION_RULES.maxNameLength} chars)`);
    }
    
    // Allow only alphanumeric, spaces, and basic punctuation
    if (!/^[a-zA-Z0-9\s\-'&.]+$/.test(trimmedName)) {
      throw new Error('Pizza name contains invalid characters');
    }
  }
  
  private static validatePrice(price: number): void {
    if (typeof price !== 'number' || isNaN(price)) {
      throw new Error('Price must be a valid number');
    }
    
    if (price < VALIDATION_RULES.minPrice || price > VALIDATION_RULES.maxPrice) {
      throw new Error(`Price must be between €${VALIDATION_RULES.minPrice} and €${VALIDATION_RULES.maxPrice}`);
    }
  }
  
  static getDefaultMenu(): PizzaType[] {
    return [
      { id: 1, name: 'Margherita', price: 10.00, available: true },
      { id: 2, name: 'Pepperoni', price: 12.50, available: true },
      { id: 3, name: 'Hawaiian', price: 13.00, available: true },
      { id: 4, name: 'Quattro Stagioni', price: 14.50, available: true },
      { id: 5, name: 'Vegetarian', price: 11.50, available: true },
      { id: 6, name: 'Meat Lovers', price: 16.00, available: true }
    ];
  }
  
  static loadMenu(): PizzaType[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => 
            item && 
            typeof item.id === 'number' && 
            typeof item.name === 'string' && 
            typeof item.price === 'number' &&
            typeof item.available === 'boolean'
          );
        }
      }
    } catch (error) {
      console.warn('Error loading menu from storage:', error);
    }
    
    // Return default menu if loading fails or no stored menu exists
    const defaultMenu = this.getDefaultMenu();
    this.saveMenu(defaultMenu);
    return defaultMenu;
  }
  
  static saveMenu(menu: PizzaType[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(menu));
    } catch (error) {
      console.error('Error saving menu to storage:', error);
      throw new Error('Failed to save menu. Storage may be full.');
    }
  }
  
  static addPizza(menu: PizzaType[], name: string, price: number): PizzaType[] {
    // Validate inputs
    this.validateName(name);
    this.validatePrice(price);
    
    const trimmedName = name.trim();
    
    // Check menu size limit
    if (menu.length >= VALIDATION_RULES.maxPizzaTypes) {
      throw new Error(`Maximum number of pizza types (${VALIDATION_RULES.maxPizzaTypes}) reached`);
    }
    
    // Check for duplicate names (case-insensitive)
    if (menu.some(pizza => pizza.name.toLowerCase() === trimmedName.toLowerCase())) {
      throw new Error(`Pizza type '${trimmedName}' already exists`);
    }
    
    // Find next available ID
    const maxId = menu.length > 0 ? Math.max(...menu.map(p => p.id)) : 0;
    const newPizza: PizzaType = {
      id: maxId + 1,
      name: trimmedName,
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      available: true
    };
    
    const newMenu = [...menu, newPizza];
    this.saveMenu(newMenu);
    return newMenu;
  }
  
  static removePizza(menu: PizzaType[], id: number): PizzaType[] {
    const pizzaIndex = menu.findIndex(pizza => pizza.id === id);
    if (pizzaIndex === -1) {
      throw new Error('Pizza not found');
    }
    
    const newMenu = menu.filter(pizza => pizza.id !== id);
    this.saveMenu(newMenu);
    return newMenu;
  }
  
  static toggleAvailability(menu: PizzaType[], id: number): PizzaType[] {
    const newMenu = menu.map(pizza => 
      pizza.id === id ? { ...pizza, available: !pizza.available } : pizza
    );
    
    this.saveMenu(newMenu);
    return newMenu;
  }
  
  static findPizzaById(menu: PizzaType[], id: number): PizzaType | undefined {
    return menu.find(pizza => pizza.id === id);
  }
}
