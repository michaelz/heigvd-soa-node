# HEIG-VD SOA Course

This repository is created for the SOA course given at **HEIG-VD, Switzerland**, in the [comem⁺ department](http://www.comem.ch)

The project is used to learn and understand elements like **stateless authentication.**

## Set up and launch

Run `npm install` in the folder and then `grunt` to launch the application. The app will be available on port 3000 ([localhost:3000](http://localhost:3000)). Port 3001 is used for websocket.

To add test content to the paragraphs, go to [/api/paragraphs/setup](http://localhost:3000/api/paragraphs/setup). This will create 100 new paragraph items each between 10 and 40 sentences. It uses the [Bullshit generator](https://github.com/sebpearce/bullshit).


- `api/..` paths are used for json content.
- `api/ui/..` are used for webix layouts (also in json format).


### Adding users

Use the following API route to create new users: [/api/users](http://localhost:3000/api/users/).

The POST format is the following:

```
{
    "username":"myUsername",
    "password":"myPassword"
}
```
