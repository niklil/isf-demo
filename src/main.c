#include <stdio.h>
#include <stdlib.h>
#include "pizza_types.h"
#include "pizza_interface.h"

int main() {
    PizzaMenu menu;
    PizzaOrder order;
    int choice;
    
    printf("=== Pizza Management System ===\n");
    printf("Loading pizza menu...\n");
    
    // Load pizza menu from file or create default
    if (!load_pizza_menu(&menu, "data/pizza_menu.txt")) {
        printf("Creating default pizza menu...\n");
        save_pizza_menu(&menu, "data/pizza_menu.txt");
    }
    
    printf("Pizza menu loaded successfully! (%d pizza types available)\n", menu.count);
    
    do {
        display_main_menu();
        choice = get_user_choice(1, 3);
        
        switch (choice) {
            case 1:
                manage_pizza_menu(&menu);
                break;
                
            case 2:
                create_order(&menu, &order);
                if (order.item_count > 0) {
                    display_order_summary(&order);
                    calculate_bill_split(&order);
                }
                break;
                
            case 3:
                printf("Thank you for using Pizza Management System!\n");
                printf("Saving menu...\n");
                save_pizza_menu(&menu, "data/pizza_menu.txt");
                break;
                
            default:
                printf("Invalid choice.\n");
        }
    } while (choice != 3);
    
    return 0;
}
