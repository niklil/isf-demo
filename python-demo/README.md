# Pizza Management System - Python Implementation

A secure Python implementation of the pizza management system with comprehensive input validation and error handling.

## Features

### Interactive Pizza Management System
- **Pizza Menu Management**: Add, remove, and view different pizza types with custom prices
- **Order Creation**: Create orders with multiple pizza types and quantities  
- **Bill Splitting**: Calculate how much each person pays when splitting the bill
- **Data Persistence**: Saves pizza menu to JSON file for future use
- **Default Menu**: Comes with pre-configured popular pizza types
- **Security**: Comprehensive input validation and sanitization

### Legacy Command-Line Version
- Simple command-line interface for quick calculations
- Takes arguments for number of pizzas and people
- Fixed pizza price of €10.00 per pizza
- Secure argument parsing with validation

## Requirements

- Python 3.7 or higher
- No external dependencies (uses only standard library)

## Project Structure

```
python-demo/
├── src/
│   ├── __init__.py           # Package initialization
│   ├── pizza_types.py        # Pizza menu management classes
│   ├── pizza_order.py        # Order and bill splitting logic
│   └── pizza_interface.py    # User interface management
├── data/
│   └── pizza_menu.json       # Persistent pizza menu storage
├── pizza_manager.py          # Main interactive application
├── pizza_split_legacy.py     # Legacy command-line version
├── requirements.txt          # Python dependencies (empty)
├── README.md                 # This file
└── SECURITY.md              # Security documentation
```

## How to Run

### Interactive Pizza Management System
```bash
cd python-demo
python3 pizza_manager.py
```

This will start the interactive interface where you can:
1. Manage the pizza menu (add/remove pizza types)
2. Create orders and calculate bill splits
3. View detailed order summaries

### Legacy Command-Line Version
```bash
cd python-demo
python3 pizza_split_legacy.py <number_of_pizzas> <number_of_people>
```

Examples:
```bash
python3 pizza_split_legacy.py 3 4
python3 pizza_split_legacy.py --help
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

## Security Features

### Input Validation
- **String sanitization**: Pizza names validated with regex patterns
- **Numeric validation**: Prices and quantities checked for valid ranges
- **Type checking**: All inputs validated for correct data types
- **Length limits**: Input length restrictions to prevent memory issues

### File Security
- **Path validation**: File paths validated to prevent directory traversal
- **File size limits**: 1MB limit on menu files to prevent DoS
- **Atomic writes**: Menu saved to temporary file first, then moved
- **Permission control**: Directory creation with proper permissions

### Error Handling
- **Graceful degradation**: Application continues on non-fatal errors
- **User-friendly messages**: Clear error messages without sensitive info
- **Exception safety**: All operations wrapped in try-catch blocks
- **Resource cleanup**: Proper file handle management

### Data Validation
- **Decimal precision**: Uses Decimal for financial calculations
- **Overflow protection**: Checks for arithmetic overflow
- **Range validation**: All numeric inputs checked against safe ranges
- **Sanitization**: Special characters filtered from names

## Default Pizza Menu

The system comes with these pre-configured pizzas:
- Margherita: €10.00
- Pepperoni: €12.50
- Hawaiian: €13.00
- Quattro Stagioni: €14.50
- Vegetarian: €11.50
- Meat Lovers: €16.00

## Error Handling Examples

```bash
# Invalid input validation
python3 pizza_split_legacy.py abc 4       # Invalid number
python3 pizza_split_legacy.py 0 4         # Zero pizzas  
python3 pizza_split_legacy.py 9999 4      # Too many pizzas
python3 pizza_split_legacy.py 3 -1        # Negative people
```

## Development

### Running Tests
```bash
# Manual testing - run the applications and test edge cases
python3 pizza_manager.py
python3 pizza_split_legacy.py --help
```

### Code Style
- Follows PEP 8 style guidelines
- Type hints for better code documentation
- Docstrings for all classes and functions
- Clear variable and function names

## Comparison with C Version

| Feature | Python | C |
|---------|--------|---|
| Memory Safety | ✅ Automatic | ✅ Manual validation |
| Input Validation | ✅ Comprehensive | ✅ Comprehensive |
| Error Handling | ✅ Exception-based | ✅ Return codes |
| File I/O | ✅ JSON format | ✅ CSV format |
| Decimal Precision | ✅ Decimal type | ✅ Double with rounding |
| Path Security | ✅ Built-in | ✅ Manual validation |
| Unicode Support | ✅ Native | ⚠️ Limited |

## Future Enhancements

1. **Unit tests** with pytest framework
2. **Web interface** using Flask/FastAPI
3. **Database storage** with SQLite
4. **Configuration files** for customization
5. **Logging system** for audit trails
6. **Multi-currency support**
7. **Tax calculation** features
