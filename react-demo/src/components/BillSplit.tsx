import React, { useState } from 'react';
import { OrderItem, Order } from '../types/pizza';
import { OrderService } from '../services/orderService';

interface BillSplitProps {
  orderItems: OrderItem[];
  onBackToOrder: () => void;
}

const BillSplit: React.FC<BillSplitProps> = ({ orderItems, onBackToOrder }) => {
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [calculatedOrder, setCalculatedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculateSplit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (orderItems.length === 0) {
      setError('No items in order. Please add some pizzas first.');
      return;
    }

    try {
      const order = OrderService.calculateOrder(orderItems, peopleCount);
      setCalculatedOrder(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate bill split');
      setCalculatedOrder(null);
    }
  };

  const handlePeopleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setPeopleCount(value);
    
    // Recalculate if we already have a calculation
    if (calculatedOrder && orderItems.length > 0) {
      try {
        const order = OrderService.calculateOrder(orderItems, value);
        setCalculatedOrder(order);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid number of people');
        setCalculatedOrder(null);
      }
    }
  };

  return (
    <div className="bill-split">
      <div className="section-header">
        <h2>Bill Split Calculator</h2>
        <button className="btn btn-secondary" onClick={onBackToOrder}>
          ← Back to Order
        </button>
      </div>

      {orderItems.length === 0 ? (
        <div className="empty-state">
          <p>No order to split. Please create an order first.</p>
          <button className="btn btn-primary" onClick={onBackToOrder}>
            Create Order
          </button>
        </div>
      ) : (
        <>
          {/* Order Summary */}
          <section className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-details">
              {orderItems.map((item) => (
                <div key={item.pizza.id} className="order-detail-item">
                  <span className="item-name">{item.pizza.name}</span>
                  <span className="item-quantity">×{item.quantity}</span>
                  <span className="item-price">{OrderService.formatCurrency(item.pizza.price)}</span>
                  <span className="item-subtotal">{OrderService.formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="order-total">
                <strong>
                  Total: {OrderService.formatCurrency(orderItems.reduce((sum, item) => sum + item.subtotal, 0))}
                </strong>
              </div>
            </div>
          </section>

          {/* Bill Split Form */}
          <section className="split-calculator">
            <h3>Split the Bill</h3>
            <form onSubmit={handleCalculateSplit} className="split-form">
              <div className="form-group">
                <label htmlFor="people-count">Number of People:</label>
                <input
                  id="people-count"
                  type="number"
                  value={peopleCount}
                  onChange={handlePeopleCountChange}
                  min="1"
                  max="1000"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Calculate Split
              </button>
            </form>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </section>

          {/* Results */}
          {calculatedOrder && (
            <section className="split-results">
              <h3>Bill Split Results</h3>
              <div className="results-card">
                <div className="result-item">
                  <span className="label">Total Bill:</span>
                  <span className="value">{OrderService.formatCurrency(calculatedOrder.total)}</span>
                </div>
                <div className="result-item">
                  <span className="label">Number of People:</span>
                  <span className="value">{calculatedOrder.peopleCount}</span>
                </div>
                <div className="result-item highlight">
                  <span className="label">Cost per Person:</span>
                  <span className="value">{OrderService.formatCurrency(calculatedOrder.costPerPerson)}</span>
                </div>
              </div>

              <div className="split-summary">
                <p>
                  <strong>Summary:</strong> {OrderService.getOrderSummary(calculatedOrder)}
                </p>
              </div>

              {/* Quick Copy */}
              <div className="quick-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    const summary = OrderService.getOrderSummary(calculatedOrder);
                    navigator.clipboard.writeText(summary).then(() => {
                      alert('Summary copied to clipboard!');
                    }).catch(() => {
                      console.log('Clipboard not available');
                    });
                  }}
                >
                  📋 Copy Summary
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default BillSplit;
