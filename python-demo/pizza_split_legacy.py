#!/usr/bin/env python3
"""
Pizza Bill Splitter - Legacy Command Line Version
Simple command-line tool for calculating pizza bill splits
"""

import sys
import argparse
from decimal import Decimal

# Security constants
MAX_PIZZAS = 1000
MAX_PEOPLE = 1000
PIZZA_PRICE = Decimal('10.00')

def validate_positive_int(value: str, name: str, max_val: int) -> int:
    """Validate and convert string to positive integer"""
    try:
        num = int(value)
    except ValueError:
        raise ValueError(f"{name} must be a valid integer")
    
    if num <= 0:
        raise ValueError(f"{name} must be positive")
    
    if num > max_val:
        raise ValueError(f"{name} too large (max {max_val})")
    
    return num

def main():
    """Main entry point for legacy pizza splitter"""
    parser = argparse.ArgumentParser(
        description="Calculate pizza delivery bill split",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=f"""
Examples:
  {sys.argv[0]} 3 4    # 3 pizzas split among 4 people
  
Note: Each pizza costs €{PIZZA_PRICE}
        """
    )
    
    parser.add_argument(
        'pizzas',
        type=str,
        help=f'Number of pizzas (1-{MAX_PIZZAS})'
    )
    
    parser.add_argument(
        'people',
        type=str,
        help=f'Number of people (1-{MAX_PEOPLE})'
    )
    
    try:
        args = parser.parse_args()
        
        # Validate arguments
        num_pizzas = validate_positive_int(args.pizzas, "Number of pizzas", MAX_PIZZAS)
        num_people = validate_positive_int(args.people, "Number of people", MAX_PEOPLE)
        
        # Calculate totals
        total_bill = num_pizzas * PIZZA_PRICE
        cost_per_person = (total_bill / num_people).quantize(Decimal('0.01'))
        
        # Display results
        print("=== Pizza Delivery Bill Splitter ===\\n")
        print("=== Bill Split Results ===")
        print(f"Number of pizzas: {num_pizzas}")
        print(f"Price per pizza: €{PIZZA_PRICE}")
        print(f"Total bill: €{total_bill}")
        print(f"Number of people: {num_people}")
        print(f"Cost per person: €{cost_per_person}")
        
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\\nOperation cancelled.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
