# Pizza Delivery Bill Splitter

A simple C terminal application that calculates how to split a pizza delivery bill among multiple people.

## Features

- Takes command-line arguments for number of pizzas and people
- Fixed pizza price of 10€ per pizza
- Calculates and displays the cost per person
- Input validation for invalid arguments

## Requirements

- macOS with Xcode Command Line Tools (for clang compiler)
- Terminal application

## How to Compile

### Using Make (Recommended)
```bash
make
```

### Manual Compilation
```bash
clang -Wall -Wextra -std=c99 -o pizza_split pizza_split.c
```

## How to Run

After compiling, run the program with two arguments:
```bash
./pizza_split <number_of_pizzas> <number_of_people>
```

### Arguments:
- `number_of_pizzas`: How many pizzas to order (positive integer)
- `number_of_people`: How many people will split the bill (positive integer)

## Example Usage

```bash
./pizza_split 3 4
```

Output:
```
=== Pizza Delivery Bill Splitter ===

=== Bill Split Results ===
Number of pizzas: 3
Price per pizza: 10€
Total bill: 30.00€
Number of people: 4
Cost per person: 7.50€
```

## Error Handling

The program will show usage instructions if:
- Wrong number of arguments provided
- Invalid (non-positive) numbers entered

Example:
```bash
./pizza_split
# Output: Usage: ./pizza_split <number_of_pizzas> <number_of_people>
```

## Additional Commands

- `make clean` - Remove compiled files
- `make install` - Install to /usr/local/bin (requires sudo)
- `make uninstall` - Remove from /usr/local/bin (requires sudo)
