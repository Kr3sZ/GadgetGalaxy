# Base image for builds
FROM golang:1.21-alpine AS builder

# Working directory for container
WORKDIR /app

# Dependencies
COPY go.mod go.sum ./
RUN go mod download

# Application
COPY . .

# Build
RUN go build -o server .

# Final image
FROM alpine:latest

# Finalizing
WORKDIR /app
COPY --from=builder /app/server .

# Port exposion
EXPOSE 8080

# Run
CMD ["./server"]