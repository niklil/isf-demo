#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    int num_pizzas;
    int num_people;
    double pizza_price = 10.0; // 10€ per pizza
    double total_bill;
    double cost_per_person;
    
    printf("=== Pizza Delivery Bill Splitter ===\n\n");
    
    // Check if correct number of arguments provided
    if (argc != 3) {
        printf("Usage: %s <number_of_pizzas> <number_of_people>\n", argv[0]);
        printf("Example: %s 3 4\n", argv[0]);
        printf("Note: Each pizza costs %.0f€\n", pizza_price);
        return 1;
    }
    
    // Parse command line arguments
    num_pizzas = atoi(argv[1]);
    num_people = atoi(argv[2]);
    
    // Validate inputs
    if (num_pizzas <= 0) {
        printf("Error: Number of pizzas must be a positive number.\n");
        return 1;
    }
    
    if (num_people <= 0) {
        printf("Error: Number of people must be a positive number.\n");
        return 1;
    }
    
    // Calculate the total bill and cost per person
    total_bill = num_pizzas * pizza_price;
    cost_per_person = total_bill / num_people;
    
    // Display the results
    printf("=== Bill Split Results ===\n");
    printf("Number of pizzas: %d\n", num_pizzas);
    printf("Price per pizza: %.0f€\n", pizza_price);
    printf("Total bill: %.2f€\n", total_bill);
    printf("Number of people: %d\n", num_people);
    printf("Cost per person: %.2f€\n", cost_per_person);
    
    return 0;
}
