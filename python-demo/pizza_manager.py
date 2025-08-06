#!/usr/bin/env python3
"""
Pizza Management System - Main Application
A secure Python implementation for managing pizza orders and bill splitting
"""

import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.pizza_interface import PizzaInterface

def main():
    """Main entry point"""
    try:
        app = PizzaInterface()
        app.run()
    except KeyboardInterrupt:
        print("\n\nApplication terminated by user.")
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
