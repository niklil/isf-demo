import React, { useState } from 'react';
import { PizzaType } from '../types/pizza';
import { OrderService } from '../services/orderService';

interface PizzaMenuProps {
  menu: PizzaType[];
  onAddPizza: (name: string, price: number) => void;
  onRemovePizza: (id: number) => void;
  onToggleAvailability: (id: number) => void;
}

const PizzaMenu: React.FC<PizzaMenuProps> = ({
  menu,
  onAddPizza,
  onRemovePizza,
  onToggleAvailability
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPizzaName, setNewPizzaName] = useState('');
  const [newPizzaPrice, setNewPizzaPrice] = useState('');

  const handleSubmitNewPizza = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPizzaName.trim()) {
      return;
    }
    
    const price = parseFloat(newPizzaPrice);
    if (isNaN(price)) {
      return;
    }
    
    onAddPizza(newPizzaName.trim(), price);
    
    // Reset form
    setNewPizzaName('');
    setNewPizzaPrice('');
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setNewPizzaName('');
    setNewPizzaPrice('');
    setShowAddForm(false);
  };

  return (
    <div className="pizza-menu">
      <div className="section-header">
        <h2>Pizza Menu Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          ➕ Add New Pizza
        </button>
      </div>

      {showAddForm && (
        <form className="add-pizza-form" onSubmit={handleSubmitNewPizza}>
          <h3>Add New Pizza Type</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pizza-name">Pizza Name:</label>
              <input
                id="pizza-name"
                type="text"
                value={newPizzaName}
                onChange={(e) => setNewPizzaName(e.target.value)}
                placeholder="Enter pizza name"
                maxLength={50}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pizza-price">Price (€):</label>
              <input
                id="pizza-price"
                type="number"
                value={newPizzaPrice}
                onChange={(e) => setNewPizzaPrice(e.target.value)}
                placeholder="0.00"
                min="0.01"
                max="999.99"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              Add Pizza
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelAdd}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="menu-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pizza Name</th>
              <th>Price</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((pizza) => (
              <tr key={pizza.id} className={!pizza.available ? 'unavailable' : ''}>
                <td>{pizza.id}</td>
                <td>{pizza.name}</td>
                <td>{OrderService.formatCurrency(pizza.price)}</td>
                <td>
                  <span className={`availability ${pizza.available ? 'available' : 'unavailable'}`}>
                    {pizza.available ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className={`btn btn-sm ${pizza.available ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => onToggleAvailability(pizza.id)}
                      title={pizza.available ? 'Mark as unavailable' : 'Mark as available'}
                    >
                      {pizza.available ? '🚫' : '✅'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onRemovePizza(pizza.id)}
                      title="Remove pizza type"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {menu.length === 0 && (
          <div className="empty-state">
            <p>No pizza types in menu. Add some pizzas to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzaMenu;
