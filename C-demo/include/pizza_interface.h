#ifndef PIZZA_INTERFACE_H
#define PIZZA_INTERFACE_H

#include "pizza_types.h"

typedef struct {
    char pizza_name[MAX_PIZZA_NAME_LENGTH];
    int quantity;
    double unit_price;
} OrderItem;

typedef struct {
    OrderItem items[MAX_PIZZA_TYPES];
    int item_count;
    double total_amount;
    int num_people;
} PizzaOrder;

// Function declarations
void display_main_menu(void);
void manage_pizza_menu(PizzaMenu *menu);
void create_order(const PizzaMenu *menu, PizzaOrder *order);
void display_order_summary(const PizzaOrder *order);
void calculate_bill_split(const PizzaOrder *order);
int get_user_choice(int min, int max);
void clear_input_buffer(void);

#endif
