#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../include/pizza_interface.h"
#include "../include/pizza_types.h"

#define MENU_FILE_PATH "data/pizza_menu.txt"

void display_main_menu(void) {
    printf("\n=== Pizza Management System ===\n");
    printf("1. Manage Pizza Menu\n");
    printf("2. Create Order & Calculate Split\n");
    printf("3. Exit\n");
    printf("Choose an option (1-3): ");
}

void manage_pizza_menu(PizzaMenu *menu) {
    int choice;
    char name[MAX_PIZZA_NAME_LENGTH];
    double price;
    
    do {
        printf("\n=== Pizza Menu Management ===\n");
        printf("1. View Pizza Menu\n");
        printf("2. Add New Pizza Type\n");
        printf("3. Remove Pizza Type\n");
        printf("4. Back to Main Menu\n");
        printf("Choose an option (1-4): ");
        
        choice = get_user_choice(1, 4);
        
        switch (choice) {
            case 1:
                display_pizza_menu(menu);
                break;
                
            case 2:
                printf("Enter pizza name: ");
                clear_input_buffer();
                if (fgets(name, sizeof(name), stdin) == NULL) {
                    printf("Error: Failed to read input.\n");
                    break;
                }
                name[strcspn(name, "\n")] = '\0'; // Remove newline
                
                // Validate pizza name length and content
                if (strlen(name) == 0) {
                    printf("Error: Pizza name cannot be empty.\n");
                    break;
                }
                
                printf("Enter price (€): ");
                if (scanf("%lf", &price) != 1 || price < MIN_PRICE || price > MAX_PRICE) {
                    printf("Error: Invalid price (must be €%.2f-€%.2f).\n", MIN_PRICE, MAX_PRICE);
                    clear_input_buffer();
                    break;
                }
                
                add_pizza_type(menu, name, price);
                if (!save_pizza_menu(menu, MENU_FILE_PATH)) {
                    printf("Warning: Could not save menu to file.\n");
                }
                break;
                
            case 3:
                display_pizza_menu(menu);
                printf("Enter pizza name to remove: ");
                clear_input_buffer();
                if (fgets(name, sizeof(name), stdin) == NULL) {
                    printf("Error: Failed to read input.\n");
                    break;
                }
                name[strcspn(name, "\n")] = '\0'; // Remove newline
                
                // Validate input
                if (strlen(name) == 0) {
                    printf("Error: Pizza name cannot be empty.\n");
                    break;
                }
                
                remove_pizza_type(menu, name);
                if (!save_pizza_menu(menu, MENU_FILE_PATH)) {
                    printf("Warning: Could not save menu to file.\n");
                }
                break;
                
            case 4:
                printf("Returning to main menu...\n");
                break;
        }
    } while (choice != 4);
}

void create_order(const PizzaMenu *menu, PizzaOrder *order) {
    order->item_count = 0;
    order->total_amount = 0.0;
    
    printf("\n=== Create Pizza Order ===\n");
    display_pizza_menu(menu);
    
    int continue_ordering = 1;
    while (continue_ordering && order->item_count < MAX_PIZZA_TYPES) {
        printf("Enter pizza ID (1-%d) or 0 to finish: ", menu->count);
        int pizza_id = get_user_choice(0, menu->count);
        
        if (pizza_id == 0) {
            continue_ordering = 0;
            break;
        }
        
        int pizza_index = pizza_id - 1;
        if (!menu->pizzas[pizza_index].available) {
            printf("Sorry, %s is not available.\n", menu->pizzas[pizza_index].name);
            continue;
        }
        
        printf("Enter quantity for %s: ", menu->pizzas[pizza_index].name);
        int quantity;
        if (scanf("%d", &quantity) != 1 || quantity <= 0 || quantity > MAX_QUANTITY) {
            printf("Error: Invalid quantity (must be 1-%d).\n", MAX_QUANTITY);
            clear_input_buffer();
            continue;
        }
        
        // Check for potential integer overflow
        double item_total = quantity * menu->pizzas[pizza_index].price;
        if (order->total_amount + item_total < order->total_amount) {
            printf("Error: Order total would overflow. Please reduce quantity.\n");
            continue;
        }
        
        // Add to order using safe string copy
        strncpy(order->items[order->item_count].pizza_name, menu->pizzas[pizza_index].name, MAX_PIZZA_NAME_LENGTH - 1);
        order->items[order->item_count].pizza_name[MAX_PIZZA_NAME_LENGTH - 1] = '\0';
        order->items[order->item_count].quantity = quantity;
        order->items[order->item_count].unit_price = menu->pizzas[pizza_index].price;
        order->total_amount += item_total;
        order->item_count++;
        
        printf("Added %d x %s to order.\n", quantity, menu->pizzas[pizza_index].name);
        
        printf("Continue ordering? (1=Yes, 0=No): ");
        continue_ordering = get_user_choice(0, 1);
    }
    
    if (order->item_count == 0) {
        printf("No items in order.\n");
        return;
    }
    
    printf("Enter number of people splitting the bill: ");
    if (scanf("%d", &order->num_people) != 1 || order->num_people <= 0) {
        printf("Error: Invalid number of people.\n");
        order->num_people = 1;
    }
}

void display_order_summary(const PizzaOrder *order) {
    if (order->item_count == 0) {
        printf("No items in order.\n");
        return;
    }
    
    printf("\n=== Order Summary ===\n");
    printf("%-25s %-8s %-10s %-10s\n", "Pizza", "Qty", "Unit Price", "Subtotal");
    printf("-------------------------------------------------------\n");
    
    for (int i = 0; i < order->item_count; i++) {
        double subtotal = order->items[i].quantity * order->items[i].unit_price;
        printf("%-25s %-8d €%-9.2f €%-9.2f\n", 
               order->items[i].pizza_name,
               order->items[i].quantity,
               order->items[i].unit_price,
               subtotal);
    }
    
    printf("-------------------------------------------------------\n");
    printf("Total Amount: €%.2f\n", order->total_amount);
    printf("Number of People: %d\n", order->num_people);
}

void calculate_bill_split(const PizzaOrder *order) {
    if (order->item_count == 0 || order->num_people <= 0) {
        printf("Invalid order or number of people.\n");
        return;
    }
    
    double cost_per_person = order->total_amount / order->num_people;
    
    printf("\n=== Bill Split Results ===\n");
    printf("Total bill: €%.2f\n", order->total_amount);
    printf("Number of people: %d\n", order->num_people);
    printf("Cost per person: €%.2f\n", cost_per_person);
}

int get_user_choice(int min, int max) {
    int choice;
    while (scanf("%d", &choice) != 1 || choice < min || choice > max) {
        printf("Invalid input. Please enter a number between %d and %d: ", min, max);
        clear_input_buffer();
    }
    return choice;
}

void clear_input_buffer(void) {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}
