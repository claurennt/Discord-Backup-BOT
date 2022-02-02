
[]("/BOT_Icon.png")
# DISCORD BACKUP BOT

The purpose of this repository is to set up a Discord Backup BOT that creates a backup of a given server and eventually loads the Backup on the server if asked to.

## Setup

1. Clone the repo

```bash
git clone https://github.com/claurennt/Discord-Backup-BOT.git
```

2. Run:

```bash
npm install
```

3. Go to [DISCORD DEVELOPERS APPLICATIONS](https://discord.com/developers/applications) and create a New Application. From the Bot section, click on "add bot". Once the Bot has been added copy the Bot's Token.
4. Store the Bot's Token in your .env file as BOT_TOKEN
5. Go to the **OAuth-> Url Generator** Section. Select **bot** under "scope" and **Administrator** under "permissions".
   Scroll down to find the **GENERATED URL**, copy it and paste it into the browser. (This url is used to connect your BOT to your chosen server).
6. Choose the server and authorize. Your BOT is now connected!
7. Store the SERVER ID in your .env file as DISCORD_SERVER_ID
8. Store the the MongoDB connection string in your .env file as MONGO_DB_CONNECTION_URI
9. Store a secret confirmation command in your .env file as BACKUP_LOAD_CONFIRMATION_COMMAND

## Specifications

A Cron Job is creating the backup of the server every day at 9 PM (Berlin time) **NB: Server must be on for the backup to be created**.
The created backup is then automatically saved in a MongoDB database.

In order to load the backup on the server, two steps are required:

- make a GET request to ` /load/{id}` where "id" is a MongoDB ObjectId value
- check the terminal and reply to the prompt with the valid confirmation command (must match the BACKUP_LOAD_CONFIRMATION_COMMAND stored in the .env file)
  If the command is valid the backup will be automatically loaded on the server, aka some magic will happen :)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
