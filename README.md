# merkator front end

This repo contains the front end and UI of the merkator application.  This application provides a solution to enable the adventure enthusiasts to plan a trip which may last over several days or contain several routes within it.

## Running the front end application

To run this code after pulling it from the repo, you'll need to create a .env file and add values to the global variables.

```env
# This is what your .env file will need to look like 
VITE_MAPBOX_API_ACCESS_TOKEN=[replace with mapbox api access token]
VITE_VM_IP=[replace with the IP address or local host followed by the port number]
```
More details on these environment variables can be found in the appendices of the project report.

## Dependencies
If the project asks for external dependencies to be loaded a list can be found in the package.json file

## Developing

Once you've pulled the repo, run the application in dev mode using the following commands.

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.