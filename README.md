# DiscordBackup-test

The purpose of this repository is to set up a Discord Backup BOT that creates a backup of a given server and eventually loads the Backup on the server if asked to.

The BOT creates a backup of the server at a given time/day/month.
The created backup is then automatically saved in a MongoDB database.

In order to load the backup on the server, two steps are required:

- make a GET request to ```/load/{id}``` where id is a MongoDB ObjectId value
- reply to the prompt in the terminal with the valid confirmation command

if the command is valid the backup will be automatically loaded on the server, aka some magic will happen :)

