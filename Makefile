# Makefile for Pizza Bill Splitter
# Compiles on macOS using clang (default C compiler)

CC = clang
CFLAGS = -Wall -Wextra -std=c99
TARGET = pizza_split
SOURCE = pizza_split.c

# Default target
all: $(TARGET)

# Compile the program
$(TARGET): $(SOURCE)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCE)

# Clean up compiled files
clean:
	rm -f $(TARGET)

# Install (optional - copies to /usr/local/bin)
install: $(TARGET)
	cp $(TARGET) /usr/local/bin/

# Uninstall
uninstall:
	rm -f /usr/local/bin/$(TARGET)

.PHONY: all clean install uninstall
