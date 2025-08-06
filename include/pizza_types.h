#ifndef PIZZA_TYPES_H
#define PIZZA_TYPES_H

#define MAX_PIZZA_NAME_LENGTH 50
#define MAX_PIZZA_TYPES 20

typedef struct {
    char name[MAX_PIZZA_NAME_LENGTH];
    double price;
    int available;
} PizzaType;

typedef struct {
    PizzaType pizzas[MAX_PIZZA_TYPES];
    int count;
} PizzaMenu;

// Function declarations
int load_pizza_menu(PizzaMenu *menu, const char *filename);
int save_pizza_menu(const PizzaMenu *menu, const char *filename);
void add_pizza_type(PizzaMenu *menu, const char *name, double price);
void display_pizza_menu(const PizzaMenu *menu);
int find_pizza_by_name(const PizzaMenu *menu, const char *name);
void remove_pizza_type(PizzaMenu *menu, const char *name);
void init_default_menu(PizzaMenu *menu);

#endif
