# LEGO Sets: a Full Stack Web Application

A responsive e-commerce web application for browsing and buying LEGO sets, built for the COMPI8023 Full Stack Development module at DkIT. React (functional components) on the client, Node/Express with a RESTful API on the server, MongoDB via Mongoose for storage.

## Features

- Responsive layout for phone, tablet and laptop
- Product browsing with search, sort and filtering; multiple images per product, live stock levels
- Shopping cart that works for both logged-in users and guests
- Checkout and order history, including self-service order returns (which restock the item)
- Registration and login with client-side and server-side validation
- JWT authentication (RS256, signed with an RSA key pair) that keeps users logged in across browser sessions
- Profile management: display name, email, password and profile photo
- Three access levels - administrator, logged-in user and guest. Enforced on both the client and the API

### Access levels

| Level | Can do |
| --- | --- |
| Guest | View products, add to cart, check out, register a new account |
| Logged-in user | Everything a guest can, plus view their own order history and return an order (restocks the product) |
| Administrator | View/create/edit/delete products, adjust stock levels, view all users and their purchase history, delete users |

## Tech stack

- **Client**: React (functional components + hooks), React Router, Axios, SCSS. Bootstrapped with Create React App
- **Server**: Node.js, Express, Mongoose (MongoDB)
- **Auth**: JSON Web Tokens signed with RS256, verified against a `.pem` key pair

## Project structure

```
client/src/
  components/   reusable UI pieces used across pages
  pages/        top-level routed views, composed from components/
  config/       shared client-side constants
  utils/        shared helpers (guest cart identity, client-side validators)
  scss/         single SCSS source file for the whole app
  css/          compiled CSS output (generated, not hand-written)

server/
  routes/       Express routers, one file per resource, RESTful endpoints
  models/       Mongoose schemas
  middleware/   auth, admin-gating and centralized error handling
  config/       DB connection and key loading
  keys/         RSA key pair used for JWT signing (not committed)
```

## Project Setup

Prerequisites: Node.js 18+, npm and a local MongoDB server running on the default port.

This project needs two things that are not committed to git: a `server/.env` file and an RSA key pair in `server/keys/`.

### Environment variables

Copy `server/.env.example` to `server/.env` and fill in real values:

```bash
cp server/.env.example server/.env
```

| Variable | Meaning |
| --- | --- |
| `DB_NAME` | Name of the MongoDB database to connect to (`mongodb://localhost/<DB_NAME>`) |
| `MAX_LIMIT_PER_QUERY` | Upper bound on `limit` for paginated product queries |
| `JWT_EXPIRY` | How long issued JWTs stay valid (e.g. `30d`) |
| `PASSWORD_SALT_ROUNDS` | bcrypt cost factor used when hashing user passwords |
| `ACCESS_LEVEL_NORMAL_USER` / `ACCESS_LEVEL_ADMIN` | Numeric access levels stored on each user; must match `client/src/config/global_constants.js` |
| `ADMIN_EMAIL` / `ADMIN_NAME` / `ADMIN_PASSWORD` | Credentials for the admin account the server creates automatically on first boot if one doesn't already exist |

### JWT signing keys

Login issues JWTs signed with RS256, verified against the matching public key. Generate a fresh key pair into `server/keys/`:

```bash
mkdir -p server/keys
openssl genpkey -algorithm RSA -out server/keys/private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -in server/keys/private.pem -pubout -out server/keys/public.pem
```

## Running the project

Install dependencies in both folders, then start each independently (two terminals):

```bash
cd server && npm install && npm start   # http://localhost:5000
cd client && npm install && npm start   # http://localhost:3000
```

The client's `npm start` and `npm run build` both recompile `client/src/scss/scss.scss` into `client/src/css/scss.css` first, so there's no separate SCSS build step to run by hand.
