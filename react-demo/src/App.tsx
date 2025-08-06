import React, { useState, useEffect } from 'react';
import './App.css';
import { PizzaType, ViewMode, OrderItem } from './types/pizza';
import { PizzaMenuService } from './services/pizzaService';
import { OrderService } from './services/orderService';
import PizzaMenu from './components/PizzaMenu';
import OrderCreation from './components/OrderCreation';
import BillSplit from './components/BillSplit';
import Navigation from './components/Navigation';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.MENU_MANAGEMENT);
  const [pizzaMenu, setPizzaMenu] = useState<PizzaType[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Load pizza menu on component mount
  useEffect(() => {
    try {
      const menu = PizzaMenuService.loadMenu();
      setPizzaMenu(menu);
    } catch (err) {
      setError('Failed to load pizza menu');
    }
  }, []);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const showError = (message: string) => {
    setError(message);
    setSuccess('');
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setError('');
  };

  const handleAddPizza = (name: string, price: number) => {
    try {
      const newMenu = PizzaMenuService.addPizza(pizzaMenu, name, price);
      setPizzaMenu(newMenu);
      showSuccess(`Added ${name} to menu`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to add pizza');
    }
  };

  const handleRemovePizza = (id: number) => {
    try {
      const pizza = PizzaMenuService.findPizzaById(pizzaMenu, id);
      if (pizza) {
        const newMenu = PizzaMenuService.removePizza(pizzaMenu, id);
        setPizzaMenu(newMenu);
        showSuccess(`Removed ${pizza.name} from menu`);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to remove pizza');
    }
  };

  const handleToggleAvailability = (id: number) => {
    try {
      const newMenu = PizzaMenuService.toggleAvailability(pizzaMenu, id);
      setPizzaMenu(newMenu);
      showSuccess('Pizza availability updated');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update availability');
    }
  };

  const handleAddToOrder = (pizzaId: number, quantity: number) => {
    try {
      const pizza = PizzaMenuService.findPizzaById(pizzaMenu, pizzaId);
      if (!pizza) {
        throw new Error('Pizza not found');
      }

      // Check if pizza already in order
      const existingIndex = orderItems.findIndex(item => item.pizza.id === pizzaId);
      if (existingIndex >= 0) {
        // Update quantity
        const newItems = [...orderItems];
        const newQuantity = newItems[existingIndex].quantity + quantity;
        const newOrderItem = OrderService.createOrderItem(pizza, newQuantity);
        newItems[existingIndex] = newOrderItem;
        setOrderItems(newItems);
      } else {
        // Add new item
        const newOrderItem = OrderService.createOrderItem(pizza, quantity);
        setOrderItems([...orderItems, newOrderItem]);
      }
      
      showSuccess(`Added ${quantity}x ${pizza.name} to order`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to add to order');
    }
  };

  const handleRemoveFromOrder = (pizzaId: number) => {
    const newItems = orderItems.filter(item => item.pizza.id !== pizzaId);
    setOrderItems(newItems);
    showSuccess('Item removed from order');
  };

  const handleClearOrder = () => {
    setOrderItems([]);
    showSuccess('Order cleared');
  };

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    clearMessages();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍕 Pizza Management System</h1>
        <Navigation currentView={currentView} onViewChange={handleViewChange} />
      </header>

      <main className="App-main">
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={clearMessages} className="alert-close">×</button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
            <button onClick={clearMessages} className="alert-close">×</button>
          </div>
        )}

        {currentView === ViewMode.MENU_MANAGEMENT && (
          <PizzaMenu
            menu={pizzaMenu}
            onAddPizza={handleAddPizza}
            onRemovePizza={handleRemovePizza}
            onToggleAvailability={handleToggleAvailability}
          />
        )}

        {currentView === ViewMode.ORDER_CREATION && (
          <OrderCreation
            menu={pizzaMenu}
            orderItems={orderItems}
            onAddToOrder={handleAddToOrder}
            onRemoveFromOrder={handleRemoveFromOrder}
            onClearOrder={handleClearOrder}
            onProceedToSplit={() => setCurrentView(ViewMode.BILL_SPLIT)}
          />
        )}

        {currentView === ViewMode.BILL_SPLIT && (
          <BillSplit
            orderItems={orderItems}
            onBackToOrder={() => setCurrentView(ViewMode.ORDER_CREATION)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
