Repo archived and not maintained. Not to be confused with the [Dock Certs API](https://certs.dock.io/)

Dock VC API
===
This repo contains a barebones implementation of the [W3 VC Data model](https://www.w3.org/TR/vc-data-model/) API routes for issuing and verification.

Optional routes are not supported currently. Intended to be compatible with the plugfest2020 test specification: https://github.com/w3c-ccg/vc-examples/

Currently hosted at https://vcapi.dock.io/ - see example JSON requests to work with the API or the [Swagger Documentation](https://vcapi.dock.io/api/docs)

Starting the server
===
In dev mode:
`npm run dev`

In production mode:
`npm run start` or `forever start server.js`
