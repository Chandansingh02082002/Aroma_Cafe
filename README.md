# Aroma Cafe Website

React + Vite client and Express + MongoDB API.

## Before running

1. Install Node.js 20.19+ (or a current supported LTS release).
2. In `server`, copy `.env.example` to `.env` and fill in your real connection/secret values locally. Never commit or share `.env`.
3. **Important for missing menu/dashboard data:** the MongoDB URI must select the same database that already contains the Aroma records. The server prints the selected database name at startup. If the URI has no database name, the driver may select `test`. Set `MONGO_DB_NAME` in `server/.env` to the actual existing database name before creating/resetting the owner account.
4. Install and start the server:
   ```powershell
   cd server
   npm install
   npm run dev
   ```
5. In a second terminal, set the client API origin and run Vite:
   ```powershell
   cd client
   npm install
   npm run dev
   ```
   `VITE_API_URL` should be the server origin only, e.g. `http://localhost:5000` (do not append `/api`).

## Diagnose vanished data

From the `server` directory:

```powershell
npm run diagnose:data
```

This prints the selected database name and counts only (not customer details). If the menu count is `0` but you previously had menu items, stop here and verify `MONGO_DB_NAME` in Atlas. Do not seed a new menu into a possibly incorrect database; existing data may still be in another database.

## Create/reset the owner login

Run this from the `server` directory after confirming the database name:

```powershell
$env:RESET_OWNER_EMAIL = "your-real-owner-email@example.com"
$env:RESET_OWNER_PASSWORD = "ChooseANewUniquePassword!"
$env:RESET_OWNER_NAME = "Aroma Owner"
npm run owner:setup
```

The script updates the account with that email, or creates it if that email does not exist in the selected database. It does not modify menu items, orders, or reviews. The reset password is not printed.

## Fixes included

- Legacy menu records without an `available` field are included in public menu requests unless explicitly marked unavailable.
- Dashboard menu/orders/reviews are loaded independently so one failed request does not blank every dashboard statistic.
- MongoDB connection is awaited before the HTTP server starts, and the active database name is printed for diagnosis.
- Owner menu edit defaults support older records; a successfully saved menu item closes its editor correctly.
- API origin is shared between API helpers and dashboard calls.
