.PHONY: build run test clean lint fmt deps

# Build variables
BINARY_NAME=csdeepseek
BUILD_DIR=bin
MAIN_FILE=main.go

# Go commands
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOMOD=$(GOCMD) mod
GOLINT=golangci-lint
GOFMT=$(GOCMD) fmt

# Build flags
LDFLAGS=-ldflags "-s -w"

# Default target
all: clean build

# Build the application
build:
	@echo "Building..."
	@mkdir -p $(BUILD_DIR)
	$(GOBUILD) $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_FILE)

# Run the application
run:
	@echo "Running..."
	$(GOCMD) run $(MAIN_FILE)

# Run tests
test:
	@echo "Testing..."
	$(GOTEST) -v ./...

# Clean build files
clean:
	@echo "Cleaning..."
	$(GOCLEAN)
	rm -f $(BUILD_DIR)/$(BINARY_NAME)

# Install dependencies
deps:
	@echo "Installing dependencies..."
	$(GOMOD) download
	$(GOMOD) tidy

# Run linter
lint:
	@echo "Linting..."
	$(GOLINT) run

# Format code
fmt:
	@echo "Formatting..."
	$(GOFMT) ./...

# Install development tools
tools:
	@echo "Installing development tools..."
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Help
help:
	@echo "Available targets:"
	@echo "  all      - Clean and build the application"
	@echo "  build    - Build the application"
	@echo "  run      - Run the application"
	@echo "  test     - Run tests"
	@echo "  clean    - Clean build files"
	@echo "  deps     - Install dependencies"
	@echo "  lint     - Run linter"
	@echo "  fmt      - Format code"
	@echo "  tools    - Install development tools"
	@echo "  help     - Show this help message" 