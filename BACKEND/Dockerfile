# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server .

# Final image
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/server .
# optional: only if godotenv is used

EXPOSE 8080

CMD ["./server"]
