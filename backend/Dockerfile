# Build stage
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git curl

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/csdeepseek

# Final stage
FROM alpine:latest

# Install runtime dependencies
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/csdeepseek .

# Copy environment file
COPY env.example .env

# Expose port
EXPOSE 8080

# Run the application
CMD ["./csdeepseek"] 