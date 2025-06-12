#!/bin/bash

# Build the Go application
echo "Building Go application..."
go build -o csdeepseek .

# Make the binary executable
chmod +x csdeepseek

# Run the application
echo "Starting csdeepseek backend..."
./csdeepseek 