1. Start zookeeper and kafka containers by running the "docker-compose up -d" command.

2. Run the producer.sh script to create the topic. Send car Id and entry time as key-value pair messages.

3. Start basic-network by running the start.sh script.

4. Run the chaincode.sh script to install and instantiate the chaincode.

5. Enroll the admin through enrollAdmin.js.

6. Create views through createViews.js.

7. Start the service through node main.js.
