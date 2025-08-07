import type { ViewMode } from '../types/pizza';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const navItems = [
    { view: 'menu' as ViewMode, label: 'Manage Menu', icon: '📋' },
    { view: 'order' as ViewMode, label: 'Create Order', icon: '🛒' },
    { view: 'split' as ViewMode, label: 'Split Bill', icon: '💰' }
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
