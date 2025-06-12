# Build stage
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git curl

# Set working directory
WORKDIR /app

# Copy go mod files from backend directory
COPY backend/go.mod backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source code
COPY backend/ .

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

# Note: Using Azure environment variables instead of .env file

# Expose port (Azure will set PORT env var)
EXPOSE 80

# Run the application
CMD ["./csdeepseek"] 