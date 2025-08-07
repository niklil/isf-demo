import { useState } from 'react';
import type { PizzaType, OrderItem } from '../types/pizza';
import { OrderService } from '../services/orderService';

interface OrderCreationProps {
  menu: PizzaType[];
  orderItems: OrderItem[];
  onAddToOrder: (pizzaId: number, quantity: number) => void;
  onRemoveFromOrder: (pizzaId: number) => void;
  onClearOrder: () => void;
  onProceedToSplit: () => void;
}

const OrderCreation = ({
  menu,
  orderItems,
  onAddToOrder,
  onRemoveFromOrder,
  onClearOrder,
  onProceedToSplit
}: OrderCreationProps) => {
  const [selectedPizzaId, setSelectedPizzaId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);

  const availablePizzas = menu.filter(pizza => pizza.available);
  const orderTotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleAddToOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPizzaId === '') {
      return;
    }
    
    onAddToOrder(selectedPizzaId, quantity);
    
    // Reset form
    setSelectedPizzaId('');
    setQuantity(1);
  };

  return (
    <div className="order-creation">
      <h2>Create Pizza Order</h2>

      <div className="order-sections">
        {/* Add to Order Form */}
        <section className="add-to-order">
          <h3>Add Pizzas to Order</h3>
          
          {availablePizzas.length === 0 ? (
            <div className="empty-state">
              <p>No pizzas available. Please check the menu management.</p>
            </div>
          ) : (
            <form onSubmit={handleAddToOrder} className="order-form">
              <div className="form-group">
                <label htmlFor="pizza-select">Select Pizza:</label>
                <select
                  id="pizza-select"
                  value={selectedPizzaId}
                  onChange={(e) => setSelectedPizzaId(e.target.value === '' ? '' : parseInt(e.target.value))}
                  required
                >
                  <option value="">Choose a pizza...</option>
                  {availablePizzas.map((pizza) => (
                    <option key={pizza.id} value={pizza.id}>
                      {pizza.name} - {OrderService.formatCurrency(pizza.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max="1000"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={selectedPizzaId === ''}>
                Add to Order
              </button>
            </form>
          )}
        </section>

        {/* Current Order */}
        <section className="current-order">
          <div className="section-header">
            <h3>Current Order</h3>
            {orderItems.length > 0 && (
              <button className="btn btn-warning" onClick={onClearOrder}>
                Clear Order
              </button>
            )}
          </div>

          {orderItems.length === 0 ? (
            <div className="empty-state">
              <p>No items in order yet.</p>
            </div>
          ) : (
            <>
              <div className="order-items">
                {orderItems.map((item) => (
                  <div key={item.pizza.id} className="order-item">
                    <div className="item-info">
                      <h4>{item.pizza.name}</h4>
                      <p>
                        {OrderService.formatCurrency(item.pizza.price)} × {item.quantity} = {OrderService.formatCurrency(item.subtotal)}
                      </p>
                    </div>
                    <div className="item-controls">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onRemoveFromOrder(item.pizza.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="total">
                  <strong>Total: {OrderService.formatCurrency(orderTotal)}</strong>
                </div>
                <button
                  className="btn btn-success btn-large"
                  onClick={onProceedToSplit}
                >
                  Proceed to Bill Split →
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrderCreation;
