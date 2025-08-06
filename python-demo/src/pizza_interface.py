"""
Pizza Interface Module
Handles user interaction with secure input validation
"""

import sys
from decimal import Decimal, InvalidOperation
from .pizza_types import PizzaMenu
from .pizza_order import PizzaOrder

class PizzaInterface:
    """Manages user interface for pizza management system"""
    
    def __init__(self):
        self.menu = PizzaMenu()
        self.menu_file = "data/pizza_menu.json"
        
    def run(self):
        """Main application loop"""
        print("=== Pizza Management System ===")
        print("Loading pizza menu...")
        
        # Load menu from file or use defaults
        if not self.menu.load_from_file(self.menu_file):
            print("Creating default pizza menu...")
            self.menu.save_to_file(self.menu_file)
        
        print(f"Pizza menu loaded successfully! ({self.menu.count()} pizza types available)")
        
        while True:
            try:
                choice = self._display_main_menu()
                
                if choice == 1:
                    self._manage_pizza_menu()
                elif choice == 2:
                    self._create_order()
                elif choice == 3:
                    print("Thank you for using Pizza Management System!")
                    print("Saving menu...")
                    if not self.menu.save_to_file(self.menu_file):
                        print("Warning: Could not save menu to file.")
                    break
                
            except KeyboardInterrupt:
                print("\n\nExiting...")
                break
            except Exception as e:
                print(f"An error occurred: {e}")
    
    def _display_main_menu(self) -> int:
        """Display main menu and get user choice"""
        print("\n=== Pizza Management System ===")
        print("1. Manage Pizza Menu")
        print("2. Create Order & Calculate Split")
        print("3. Exit")
        
        return self._get_user_choice("Choose an option (1-3): ", 1, 3)
    
    def _manage_pizza_menu(self):
        """Handle pizza menu management"""
        while True:
            try:
                print("\n=== Pizza Menu Management ===")
                print("1. View Pizza Menu")
                print("2. Add New Pizza Type")
                print("3. Remove Pizza Type")
                print("4. Back to Main Menu")
                
                choice = self._get_user_choice("Choose an option (1-4): ", 1, 4)
                
                if choice == 1:
                    self.menu.display_menu()
                elif choice == 2:
                    self._add_pizza_type()
                elif choice == 3:
                    self._remove_pizza_type()
                elif choice == 4:
                    break
                    
            except Exception as e:
                print(f"Error: {e}")
    
    def _add_pizza_type(self):
        """Add a new pizza type"""
        try:
            print("Enter pizza name: ", end="")
            name = self._get_safe_input().strip()
            
            if not name:
                print("Error: Pizza name cannot be empty.")
                return
            
            price_str = self._get_safe_input("Enter price (€): ")
            try:
                price = Decimal(price_str)
            except InvalidOperation:
                print("Error: Invalid price format.")
                return
            
            self.menu.add_pizza_type(name, price)
            print(f"Pizza type '{name}' added successfully!")
            
            if not self.menu.save_to_file(self.menu_file):
                print("Warning: Could not save menu to file.")
                
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
    
    def _remove_pizza_type(self):
        """Remove a pizza type"""
        try:
            self.menu.display_menu()
            
            if self.menu.count() == 0:
                print("No pizzas to remove.")
                return
            
            name = self._get_safe_input("Enter pizza name to remove: ").strip()
            
            if not name:
                print("Error: Pizza name cannot be empty.")
                return
            
            self.menu.remove_pizza_type(name)
            print(f"Pizza type '{name}' removed successfully!")
            
            if not self.menu.save_to_file(self.menu_file):
                print("Warning: Could not save menu to file.")
                
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
    
    def _create_order(self):
        """Create and process an order"""
        try:
            order = PizzaOrder()
            
            print("\n=== Create Pizza Order ===")
            self.menu.display_menu()
            
            if self.menu.count() == 0:
                print("No pizzas available to order.")
                return
            
            # Order items
            while True:
                try:
                    pizza_id = self._get_user_choice(
                        f"Enter pizza ID (1-{self.menu.count()}) or 0 to finish: ",
                        0, self.menu.count()
                    )
                    
                    if pizza_id == 0:
                        break
                    
                    pizza = self.menu.get_pizza_by_index(pizza_id)
                    if not pizza:
                        print("Invalid pizza ID.")
                        continue
                    
                    if not pizza.available:
                        print(f"Sorry, {pizza.name} is not available.")
                        continue
                    
                    quantity = self._get_user_choice(
                        f"Enter quantity for {pizza.name}: ",
                        1, 1000
                    )
                    
                    order.add_item(pizza, quantity)
                    print(f"Added {quantity} x {pizza.name} to order.")
                    
                    continue_ordering = self._get_user_choice(
                        "Continue ordering? (1=Yes, 0=No): ",
                        0, 1
                    )
                    
                    if continue_ordering == 0:
                        break
                        
                except ValueError as e:
                    print(f"Error: {e}")
                    continue
            
            if order.item_count() == 0:
                print("No items in order.")
                return
            
            # Get number of people
            num_people = self._get_user_choice(
                "Enter number of people splitting the bill: ",
                1, 1000
            )
            
            order.set_num_people(num_people)
            
            # Display results
            order.display_summary()
            order.calculate_bill_split()
            
        except Exception as e:
            print(f"Error creating order: {e}")
    
    def _get_user_choice(self, prompt: str, min_val: int, max_val: int) -> int:
        """Get validated integer input from user"""
        while True:
            try:
                choice_str = self._get_safe_input(prompt)
                choice = int(choice_str)
                
                if min_val <= choice <= max_val:
                    return choice
                else:
                    print(f"Invalid input. Please enter a number between {min_val} and {max_val}.")
                    
            except ValueError:
                print(f"Invalid input. Please enter a number between {min_val} and {max_val}.")
            except KeyboardInterrupt:
                raise
            except Exception:
                print("Invalid input. Please try again.")
    
    def _get_safe_input(self, prompt: str = "") -> str:
        """Get safe input from user with length limits"""
        if prompt:
            print(prompt, end="")
        
        try:
            user_input = input()
            
            # Limit input length to prevent memory issues
            if len(user_input) > 1000:
                raise ValueError("Input too long")
            
            return user_input
            
        except EOFError:
            print("\nInput terminated.")
            sys.exit(0)
        except KeyboardInterrupt:
            raise
