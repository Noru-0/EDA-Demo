EventFlow
Event-driven microservices project using Node.js, Fastify, Kafka, PostgreSQL, and MongoDB.
Architecture

Gateway: Routes API requests to services.
User Service: Manages users (PostgreSQL).
Event Service: Manages events (PostgreSQL).
Registration Service: Manages event registrations (PostgreSQL).
Notification Service: Sends notifications (Kafka).
Email Service: Sends emails (Kafka).
Auditlog Service: Logs events (MongoDB).

Event Flow

Gateway receives POST /registrations.
Registration Service processes and emits registration.created.
Notification/Email Services consume and send notifications/emails.
Auditlog Service logs all events.

Setup

Install Docker and Docker Compose.
Run: docker-compose up --build
Access Gateway at: http://localhost:3000

Ports

Gateway: 3000
User Service: 3001
Event Service: 3002
Registration Service: 3003
Notification Service: 3004
Email Service: 3005
Auditlog Service: 3006
PostgreSQL: 5432
MongoDB: 27017
Kafka: 9092
