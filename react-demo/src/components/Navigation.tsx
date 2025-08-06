import React from 'react';
import { ViewMode } from '../types/pizza';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { view: ViewMode.MENU_MANAGEMENT, label: 'Manage Menu', icon: '📋' },
    { view: ViewMode.ORDER_CREATION, label: 'Create Order', icon: '🛒' },
    { view: ViewMode.BILL_SPLIT, label: 'Split Bill', icon: '💰' }
  ];

  return (
    <nav className="navigation">
      {navItems.map(({ view, label, icon }) => (
        <button
          key={view}
          className={`nav-button ${currentView === view ? 'active' : ''}`}
          onClick={() => onViewChange(view)}
        >
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
