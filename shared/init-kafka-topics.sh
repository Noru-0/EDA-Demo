#!/bin/bash
set -e

echo "🛠 Creating Kafka topics..."

kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists \
  --topic registration_created --replication-factor 1 --partitions 1

kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists \
  --topic notification_sent --replication-factor 1 --partitions 1

kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists \
  --topic email_sent --replication-factor 1 --partitions 1

echo "✅ Kafka topics created."
