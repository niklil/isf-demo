#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../include/pizza_types.h"

int load_pizza_menu(PizzaMenu *menu, const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        // If file doesn't exist, initialize with default menu
        init_default_menu(menu);
        return 0;
    }
    
    menu->count = 0;
    char line[100];
    
    while (fgets(line, sizeof(line), file) && menu->count < MAX_PIZZA_TYPES) {
        char name[MAX_PIZZA_NAME_LENGTH];
        double price;
        int available;
        
        if (sscanf(line, "%49[^,],%lf,%d", name, &price, &available) == 3) {
            strcpy(menu->pizzas[menu->count].name, name);
            menu->pizzas[menu->count].price = price;
            menu->pizzas[menu->count].available = available;
            menu->count++;
        }
    }
    
    fclose(file);
    return 1;
}

int save_pizza_menu(const PizzaMenu *menu, const char *filename) {
    FILE *file = fopen(filename, "w");
    if (!file) {
        return 0;
    }
    
    for (int i = 0; i < menu->count; i++) {
        fprintf(file, "%s,%.2f,%d\n", 
                menu->pizzas[i].name, 
                menu->pizzas[i].price, 
                menu->pizzas[i].available);
    }
    
    fclose(file);
    return 1;
}

void add_pizza_type(PizzaMenu *menu, const char *name, double price) {
    if (menu->count >= MAX_PIZZA_TYPES) {
        printf("Error: Maximum number of pizza types reached.\n");
        return;
    }
    
    // Check if pizza already exists
    if (find_pizza_by_name(menu, name) != -1) {
        printf("Error: Pizza type '%s' already exists.\n", name);
        return;
    }
    
    strcpy(menu->pizzas[menu->count].name, name);
    menu->pizzas[menu->count].price = price;
    menu->pizzas[menu->count].available = 1;
    menu->count++;
    
    printf("Pizza type '%s' added successfully!\n", name);
}

void display_pizza_menu(const PizzaMenu *menu) {
    printf("\n=== Pizza Menu ===\n");
    printf("%-3s %-25s %-10s %-10s\n", "ID", "Pizza Name", "Price", "Available");
    printf("--------------------------------------------------\n");
    
    for (int i = 0; i < menu->count; i++) {
        printf("%-3d %-25s €%-9.2f %-10s\n", 
               i + 1,
               menu->pizzas[i].name, 
               menu->pizzas[i].price,
               menu->pizzas[i].available ? "Yes" : "No");
    }
    printf("\n");
}

int find_pizza_by_name(const PizzaMenu *menu, const char *name) {
    for (int i = 0; i < menu->count; i++) {
        if (strcasecmp(menu->pizzas[i].name, name) == 0) {
            return i;
        }
    }
    return -1;
}

void remove_pizza_type(PizzaMenu *menu, const char *name) {
    int index = find_pizza_by_name(menu, name);
    if (index == -1) {
        printf("Error: Pizza type '%s' not found.\n", name);
        return;
    }
    
    // Shift all elements after the removed one
    for (int i = index; i < menu->count - 1; i++) {
        menu->pizzas[i] = menu->pizzas[i + 1];
    }
    
    menu->count--;
    printf("Pizza type '%s' removed successfully!\n", name);
}

void init_default_menu(PizzaMenu *menu) {
    menu->count = 0;
    
    add_pizza_type(menu, "Margherita", 10.00);
    add_pizza_type(menu, "Pepperoni", 12.50);
    add_pizza_type(menu, "Hawaiian", 13.00);
    add_pizza_type(menu, "Quattro Stagioni", 14.50);
    add_pizza_type(menu, "Vegetarian", 11.50);
    add_pizza_type(menu, "Meat Lovers", 16.00);
}
