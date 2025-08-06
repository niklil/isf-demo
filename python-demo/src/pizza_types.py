"""
Pizza Types Module
Handles pizza menu management with secure data validation
"""

import os
import json
import re
from typing import List, Dict, Optional, Tuple
from decimal import Decimal, InvalidOperation

# Security constants
MAX_PIZZA_NAME_LENGTH = 50
MAX_PIZZA_TYPES = 20
MAX_PRICE = Decimal('999.99')
MIN_PRICE = Decimal('0.01')
MAX_QUANTITY = 1000

class PizzaType:
    """Represents a single pizza type with validation"""
    
    def __init__(self, name: str, price: Decimal, available: bool = True):
        self.name = self._validate_name(name)
        self.price = self._validate_price(price)
        self.available = bool(available)
    
    def _validate_name(self, name: str) -> str:
        """Validate and sanitize pizza name"""
        if not isinstance(name, str):
            raise ValueError("Pizza name must be a string")
        
        # Strip whitespace and validate length
        name = name.strip()
        if not name:
            raise ValueError("Pizza name cannot be empty")
        
        if len(name) > MAX_PIZZA_NAME_LENGTH:
            raise ValueError(f"Pizza name too long (max {MAX_PIZZA_NAME_LENGTH} chars)")
        
        # Sanitize - allow only alphanumeric, spaces, and basic punctuation
        if not re.match(r'^[a-zA-Z0-9\s\-\'\&\.]+$', name):
            raise ValueError("Pizza name contains invalid characters")
        
        return name
    
    def _validate_price(self, price) -> Decimal:
        """Validate and convert price to Decimal"""
        try:
            price_decimal = Decimal(str(price))
        except (InvalidOperation, ValueError, TypeError):
            raise ValueError("Invalid price format")
        
        if price_decimal < MIN_PRICE or price_decimal > MAX_PRICE:
            raise ValueError(f"Price must be between €{MIN_PRICE} and €{MAX_PRICE}")
        
        return price_decimal.quantize(Decimal('0.01'))
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for serialization"""
        return {
            'name': self.name,
            'price': str(self.price),
            'available': self.available
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'PizzaType':
        """Create PizzaType from dictionary"""
        return cls(
            name=data['name'],
            price=Decimal(data['price']),
            available=data.get('available', True)
        )

class PizzaMenu:
    """Manages the pizza menu with secure operations"""
    
    def __init__(self):
        self.pizzas: List[PizzaType] = []
        self._init_default_menu()
    
    def _init_default_menu(self):
        """Initialize with default pizza types"""
        default_pizzas = [
            ('Margherita', '10.00'),
            ('Pepperoni', '12.50'),
            ('Hawaiian', '13.00'),
            ('Quattro Stagioni', '14.50'),
            ('Vegetarian', '11.50'),
            ('Meat Lovers', '16.00')
        ]
        
        for name, price in default_pizzas:
            try:
                self.add_pizza_type(name, Decimal(price))
            except ValueError as e:
                print(f"Warning: Could not add default pizza {name}: {e}")
    
    def add_pizza_type(self, name: str, price) -> bool:
        """Add a new pizza type with validation"""
        if len(self.pizzas) >= MAX_PIZZA_TYPES:
            raise ValueError(f"Maximum number of pizza types ({MAX_PIZZA_TYPES}) reached")
        
        # Check if pizza already exists
        if self.find_pizza_by_name(name) is not None:
            raise ValueError(f"Pizza type '{name}' already exists")
        
        pizza = PizzaType(name, price)
        self.pizzas.append(pizza)
        return True
    
    def remove_pizza_type(self, name: str) -> bool:
        """Remove a pizza type by name"""
        pizza = self.find_pizza_by_name(name)
        if pizza is None:
            raise ValueError(f"Pizza type '{name}' not found")
        
        self.pizzas.remove(pizza)
        return True
    
    def find_pizza_by_name(self, name: str) -> Optional[PizzaType]:
        """Find pizza by name (case-insensitive)"""
        name_lower = name.lower().strip()
        for pizza in self.pizzas:
            if pizza.name.lower() == name_lower:
                return pizza
        return None
    
    def get_pizza_by_index(self, index: int) -> Optional[PizzaType]:
        """Get pizza by index (1-based)"""
        if 1 <= index <= len(self.pizzas):
            return self.pizzas[index - 1]
        return None
    
    def display_menu(self):
        """Display formatted pizza menu"""
        print("\n=== Pizza Menu ===")
        print(f"{'ID':<3} {'Pizza Name':<25} {'Price':<10} {'Available':<10}")
        print("-" * 50)
        
        for i, pizza in enumerate(self.pizzas, 1):
            availability = "Yes" if pizza.available else "No"
            print(f"{i:<3} {pizza.name:<25} €{pizza.price:<9} {availability:<10}")
        print()
    
    def load_from_file(self, filename: str) -> bool:
        """Load menu from JSON file with security checks"""
        try:
            # Validate file path
            if not self._is_safe_path(filename):
                raise ValueError("Invalid file path")
            
            if not os.path.exists(filename):
                return False
            
            # Check file size (prevent DoS)
            if os.path.getsize(filename) > 1024 * 1024:  # 1MB limit
                raise ValueError("File too large")
            
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if not isinstance(data, list):
                raise ValueError("Invalid file format")
            
            # Validate and load pizzas
            new_pizzas = []
            for item in data:
                if not isinstance(item, dict):
                    continue
                try:
                    pizza = PizzaType.from_dict(item)
                    new_pizzas.append(pizza)
                except ValueError:
                    continue  # Skip invalid entries
            
            if new_pizzas:
                self.pizzas = new_pizzas
            
            return True
            
        except (json.JSONDecodeError, OSError, ValueError) as e:
            print(f"Error loading menu: {e}")
            return False
    
    def save_to_file(self, filename: str) -> bool:
        """Save menu to JSON file with security checks"""
        try:
            # Validate file path
            if not self._is_safe_path(filename):
                raise ValueError("Invalid file path")
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(filename), mode=0o755, exist_ok=True)
            
            data = [pizza.to_dict() for pizza in self.pizzas]
            
            # Write to temporary file first (atomic operation)
            temp_filename = filename + '.tmp'
            with open(temp_filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            # Move to final location
            os.rename(temp_filename, filename)
            return True
            
        except (OSError, ValueError) as e:
            print(f"Error saving menu: {e}")
            return False
    
    def _is_safe_path(self, path: str) -> bool:
        """Validate file path for security"""
        # Normalize path
        norm_path = os.path.normpath(path)
        
        # Check for path traversal attempts
        if '..' in norm_path or norm_path.startswith('/'):
            return False
        
        # Only allow files in data directory
        if not norm_path.startswith('data/'):
            return False
        
        return True
    
    def count(self) -> int:
        """Get number of pizza types"""
        return len(self.pizzas)
