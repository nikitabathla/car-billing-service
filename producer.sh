#!/bin/bash

#1. Create Topic.
docker exec -it kafka /opt/kafka_2.13-2.7.0/bin/kafka-topics.sh \
    --create \
    --zookeeper zookeeper:2181 \
    --replication-factor 1 \
    --partitions 1 \
    --topic test

#2. List Topics.
docker exec -it kafka /opt/kafka_2.13-2.7.0/bin/kafka-topics.sh \
    --list \
    --zookeeper zookeeper:2181

#3. Describe Topics.
docker exec -it kafka /opt/kafka_2.13-2.7.0/bin/kafka-topics.sh \
    --describe \
    --topic test \
    --zookeeper zookeeper:2181

#4. Send messages through producer.
docker exec -it kafka /opt/kafka_2.13-2.7.0/bin/kafka-console-producer.sh \
    --broker-list localhost:9092 \
    --topic test \
    --property "parse.key=true" \
    --property "key.separator=:"
