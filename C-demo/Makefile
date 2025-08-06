# Makefile for Pizza Management System
# Compiles on macOS using clang (default C compiler)

CC = clang
CFLAGS = -Wall -Wextra -std=c99 -Iinclude
SRCDIR = src
INCDIR = include
DATADIR = data
TARGET = pizza_manager
LEGACY_TARGET = pizza_split_legacy

# Source files
SOURCES = $(SRCDIR)/main.c $(SRCDIR)/pizza_types.c $(SRCDIR)/pizza_interface.c
LEGACY_SOURCE = $(SRCDIR)/pizza_split_legacy.c

# Object files
OBJECTS = $(SOURCES:.c=.o)

# Default target
all: $(TARGET) setup_data

# Main pizza management system
$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJECTS)

# Legacy pizza splitter (command line version)
legacy: $(LEGACY_TARGET)

$(LEGACY_TARGET): $(LEGACY_SOURCE)
	$(CC) $(CFLAGS) -o $(LEGACY_TARGET) $(LEGACY_SOURCE)

# Compile object files
$(SRCDIR)/%.o: $(SRCDIR)/%.c
	$(CC) $(CFLAGS) -c $< -o $@

# Set up data directory
setup_data:
	@mkdir -p $(DATADIR)

# Clean up compiled files
clean:
	rm -f $(TARGET) $(LEGACY_TARGET) $(SRCDIR)/*.o

# Install (optional - copies to /usr/local/bin)
install: $(TARGET)
	cp $(TARGET) /usr/local/bin/

# Uninstall
uninstall:
	rm -f /usr/local/bin/$(TARGET)

# Build both versions
both: $(TARGET) $(LEGACY_TARGET)

.PHONY: all clean install uninstall setup_data legacy both
