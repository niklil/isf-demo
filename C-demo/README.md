# Pizza Management System

A comprehensive C terminal application for managing pizza types, creating orders, and calculating bill splits among multiple people.

## Features

### Pizza Management System (Interactive)
- **Pizza Menu Management**: Add, remove, and view different pizza types with custom prices
- **Order Creation**: Create orders with multiple pizza types and quantities
- **Bill Splitting**: Calculate how much each person pays when splitting the bill
- **Data Persistence**: Saves pizza menu to file for future use
- **Default Menu**: Comes with pre-configured popular pizza types

### Legacy Command-Line Version
- Simple command-line interface for quick calculations
- Takes arguments for number of pizzas and people
- Fixed pizza price of 10€ per pizza

## Requirements

- macOS with Xcode Command Line Tools (for clang compiler)
- Terminal application

## Project Structure

```
.
├── src/
│   ├── main.c                 # Main application entry point
│   ├── pizza_types.c          # Pizza menu management functions
│   ├── pizza_interface.c      # User interface functions
│   └── pizza_split_legacy.c   # Original command-line version
├── include/
│   ├── pizza_types.h          # Pizza data structures and functions
│   └── pizza_interface.h      # Interface function declarations
├── data/
│   └── pizza_menu.txt         # Persistent pizza menu storage
├── Makefile                   # Build configuration
└── README.md                  # This file
```

## How to Compile

### Main Pizza Management System
```bash
make
```

### Legacy Command-Line Version
```bash
make legacy
```

### Both Versions
```bash
make both
```

## How to Run

### Interactive Pizza Management System
```bash
./pizza_manager
```

This will start the interactive interface where you can:
1. Manage the pizza menu (add/remove pizza types)
2. Create orders and calculate bill splits
3. View detailed order summaries

### Legacy Command-Line Version
```bash
./pizza_split_legacy <number_of_pizzas> <number_of_people>
```

Example:
```bash
./pizza_split_legacy 3 4
```

## Example Usage (Interactive System)

```
=== Pizza Management System ===
Loading pizza menu...
Pizza menu loaded successfully! (6 pizza types available)

=== Pizza Management System ===
1. Manage Pizza Menu
2. Create Order & Calculate Split
3. Exit
Choose an option (1-3): 2

=== Create Pizza Order ===

=== Pizza Menu ===
ID  Pizza Name               Price      Available 
--------------------------------------------------
1   Margherita               €10.00     Yes       
2   Pepperoni                €12.50     Yes       
3   Hawaiian                 €13.00     Yes       
4   Quattro Stagioni         €14.50     Yes       
5   Vegetarian               €11.50     Yes       
6   Meat Lovers              €16.00     Yes       

Enter pizza ID (1-6) or 0 to finish: 2
Enter quantity for Pepperoni: 2
Added 2 x Pepperoni to order.
Continue ordering? (1=Yes, 0=No): 1
Enter pizza ID (1-6) or 0 to finish: 1
Enter quantity for Margherita: 1
Added 1 x Margherita to order.
Continue ordering? (1=Yes, 0=No): 0
Enter number of people splitting the bill: 3

=== Order Summary ===
Pizza                     Qty      Unit Price Subtotal  
-------------------------------------------------------
Pepperoni                 2        €12.50     €25.00    
Margherita                1        €10.00     €10.00    
-------------------------------------------------------
Total Amount: €35.00
Number of People: 3

=== Bill Split Results ===
Total bill: €35.00
Number of people: 3
Cost per person: €11.67
```

## Default Pizza Menu

The system comes with these pre-configured pizzas:
- Margherita: €10.00
- Pepperoni: €12.50
- Hawaiian: €13.00
- Quattro Stagioni: €14.50
- Vegetarian: €11.50
- Meat Lovers: €16.00

## Additional Commands

- `make clean` - Remove compiled files
- `make install` - Install to /usr/local/bin (requires sudo)
- `make uninstall` - Remove from /usr/local/bin (requires sudo)

## Additional Commands

- `make clean` - Remove compiled files
- `make install` - Install to /usr/local/bin (requires sudo)
- `make uninstall` - Remove from /usr/local/bin (requires sudo)
