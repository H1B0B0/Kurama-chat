#Project README: Kurama-Chat

##Overview :
This project involves the development of an Internet Relay Chat (IRC) client and server using NodeJS + ExpressJS for the server and ReactJS for the client. The system is designed to handle multiple simultaneous connections, allowing users to join, create, rename, and delete channels. Additionally, it supports real-time messaging within channels, including notifications when users join or leave a channel.

##Features :
- 1. Multiple Channel Support: Users can join several channels simultaneously.
- 2. Channel Management: Ability to create, rename, and delete channels.
- 3. Real-time Notifications: Notifications for user join/leave events.
- 4. Messaging: Users can speak in channels they've joined, send private messages, and list users in channels.
Persistence
- 5. Channels and messages are persistently stored using a chosen method (file, database, etc.).
- 6. User Interaction
- 7. Users must set a nickname to use the application. No authentication system is required, but adding one is a bonus.
- 8. The client and server communicate using a chosen protocol.

##Commands :
- /nick: Set user nickname.
- /list: List available channels, with optional search.
- /create: Create a new channel.
- /delete: Delete a channel.
- /join: Join a channel.
- /quit: Leave a channel.
- /users: List users in a channel.
- /msg: Send a private message.
- /clear: clear the chat (don't work on the global chat room)

This README outlines the core functionalities and commands supported by the IRC client and server project.

#Installation : 

```docker compose up -d```
