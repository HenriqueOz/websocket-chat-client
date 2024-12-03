## Websocket chat client

Terminal chat client I developed to test my [websocket chat](https://github.com/Peguinm/websocket-chat-server)

Change the server address in the [.env file](https://github.com/Peguinm/websocket-chat-client/blob/master/.env) to connect to the server

**Run the project**

Clone the project

```
git clone https://github.com/Peguinm/websocket-chat-client.git
```

Run inside the project folder

```
docker-compose run --rm websocket-chat node --env-file=.env src/index.js
```
