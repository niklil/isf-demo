#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <errno.h>

#define MAX_PIZZAS 1000
#define MAX_PEOPLE 1000

int main(int argc, char *argv[]) {
    long num_pizzas_long;
    long num_people_long;
    int num_pizzas;
    int num_people;
    double pizza_price = 10.0; // 10€ per pizza
    double total_bill;
    double cost_per_person;
    char *endptr;
    
    printf("=== Pizza Delivery Bill Splitter ===\n\n");
    
    // Check if correct number of arguments provided
    if (argc != 3) {
        printf("Usage: %s <number_of_pizzas> <number_of_people>\n", argv[0]);
        printf("Example: %s 3 4\n", argv[0]);
        printf("Note: Each pizza costs %.0f€\n", pizza_price);
        return 1;
    }
    
    // Parse command line arguments with proper error checking
    errno = 0;
    num_pizzas_long = strtol(argv[1], &endptr, 10);
    if (errno != 0 || *endptr != '\0' || num_pizzas_long <= 0 || num_pizzas_long > MAX_PIZZAS) {
        printf("Error: Number of pizzas must be a positive integer (1-%d).\n", MAX_PIZZAS);
        return 1;
    }
    num_pizzas = (int)num_pizzas_long;
    
    errno = 0;
    num_people_long = strtol(argv[2], &endptr, 10);
    if (errno != 0 || *endptr != '\0' || num_people_long <= 0 || num_people_long > MAX_PEOPLE) {
        printf("Error: Number of people must be a positive integer (1-%d).\n", MAX_PEOPLE);
        return 1;
    }
    num_people = (int)num_people_long;
    
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
