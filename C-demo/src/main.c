#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <errno.h>
#include "pizza_types.h"
#include "pizza_interface.h"

#define MENU_FILE_PATH "data/pizza_menu.txt"

// Function to safely create data directory
int create_data_directory(void) {
    struct stat st = {0};
    if (stat("data", &st) == -1) {
        if (mkdir("data", 0755) != 0) {
            printf("Error: Could not create data directory: %s\n", strerror(errno));
            return 0;
        }
    }
    return 1;
}

int main() {
    PizzaMenu menu;
    PizzaOrder order;
    int choice;
    
    printf("=== Pizza Management System ===\n");
    printf("Loading pizza menu...\n");
    
    // Ensure data directory exists
    if (!create_data_directory()) {
        printf("Error: Could not initialize data storage.\n");
        return 1;
    }
    
    // Load pizza menu from file or create default
    if (!load_pizza_menu(&menu, MENU_FILE_PATH)) {
        printf("Creating default pizza menu...\n");
        save_pizza_menu(&menu, MENU_FILE_PATH);
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
                if (!save_pizza_menu(&menu, MENU_FILE_PATH)) {
                    printf("Warning: Could not save menu to file.\n");
                }
                break;
                
            default:
                printf("Invalid choice.\n");
        }
    } while (choice != 3);
    
    return 0;
}
