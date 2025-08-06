"""
Pizza Order Module
Handles order creation and bill splitting with secure validation
"""

from typing import List, Dict
from decimal import Decimal
from .pizza_types import PizzaType, PizzaMenu, MAX_QUANTITY

class OrderItem:
    """Represents a single item in an order"""
    
    def __init__(self, pizza: PizzaType, quantity: int):
        self.pizza_name = pizza.name
        self.unit_price = pizza.price
        self.quantity = self._validate_quantity(quantity)
        self.subtotal = self.unit_price * self.quantity
    
    def _validate_quantity(self, quantity) -> int:
        """Validate order quantity"""
        try:
            qty = int(quantity)
        except (ValueError, TypeError):
            raise ValueError("Quantity must be a valid integer")
        
        if qty <= 0:
            raise ValueError("Quantity must be positive")
        
        if qty > MAX_QUANTITY:
            raise ValueError(f"Quantity too large (max {MAX_QUANTITY})")
        
        return qty
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            'pizza_name': self.pizza_name,
            'quantity': self.quantity,
            'unit_price': str(self.unit_price),
            'subtotal': str(self.subtotal)
        }

class PizzaOrder:
    """Manages a pizza order with bill splitting"""
    
    def __init__(self):
        self.items: List[OrderItem] = []
        self.total_amount = Decimal('0.00')
        self.num_people = 1
    
    def add_item(self, pizza: PizzaType, quantity: int):
        """Add an item to the order with overflow protection"""
        if not pizza.available:
            raise ValueError(f"Pizza '{pizza.name}' is not available")
        
        order_item = OrderItem(pizza, quantity)
        
        # Check for potential overflow
        new_total = self.total_amount + order_item.subtotal
        if new_total < self.total_amount:  # Overflow detection
            raise ValueError("Order total would overflow")
        
        self.items.append(order_item)
        self.total_amount = new_total
    
    def set_num_people(self, num_people: int):
        """Set number of people splitting the bill"""
        try:
            people = int(num_people)
        except (ValueError, TypeError):
            raise ValueError("Number of people must be a valid integer")
        
        if people <= 0:
            raise ValueError("Number of people must be positive")
        
        if people > 1000:  # Reasonable upper limit
            raise ValueError("Too many people (max 1000)")
        
        self.num_people = people
    
    def get_cost_per_person(self) -> Decimal:
        """Calculate cost per person"""
        if self.num_people <= 0:
            raise ValueError("Invalid number of people")
        
        return (self.total_amount / self.num_people).quantize(Decimal('0.01'))
    
    def display_summary(self):
        """Display order summary"""
        if not self.items:
            print("No items in order.")
            return
        
        print("\n=== Order Summary ===")
        print(f"{'Pizza':<25} {'Qty':<8} {'Unit Price':<10} {'Subtotal':<10}")
        print("-" * 55)
        
        for item in self.items:
            print(f"{item.pizza_name:<25} {item.quantity:<8} "
                  f"€{item.unit_price:<9} €{item.subtotal:<9}")
        
        print("-" * 55)
        print(f"Total Amount: €{self.total_amount}")
        print(f"Number of People: {self.num_people}")
    
    def calculate_bill_split(self):
        """Display bill split calculation"""
        if not self.items or self.num_people <= 0:
            print("Invalid order or number of people.")
            return
        
        cost_per_person = self.get_cost_per_person()
        
        print("\n=== Bill Split Results ===")
        print(f"Total bill: €{self.total_amount}")
        print(f"Number of people: {self.num_people}")
        print(f"Cost per person: €{cost_per_person}")
    
    def clear(self):
        """Clear the order"""
        self.items.clear()
        self.total_amount = Decimal('0.00')
        self.num_people = 1
    
    def item_count(self) -> int:
        """Get number of items in order"""
        return len(self.items)
