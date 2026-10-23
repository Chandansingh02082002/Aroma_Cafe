# Aroma fresh data setup

This setup inserts a fresh owner login and an initial sample menu into the MongoDB database selected by `server/.env`. It does not insert fake orders or reviews, and it does not overwrite existing menu item data with the same name.

## 1. Keep your environment file

Copy your existing `server/.env` into the extracted `server` folder. Do not share it or commit it to GitHub. Confirm `MONGO_URI` points to the Atlas cluster you intend to use and, if needed, set `MONGO_DB_NAME` to the database `CafeWebsite`.

## 2. Open PowerShell in the server folder

```powershell
npm install
$env:RESET_OWNER_NAME = "Aroma Owner"
$env:RESET_OWNER_EMAIL = "owner@aroma.com"
$env:RESET_OWNER_PASSWORD = "ReplaceWithYourOwnStrongPassword!"
npm run seed:initial
```

Change the sample email if you prefer another owner email. Use a unique password of at least 8 characters. The script creates/updates the owner account with that email and adds 20 menu items (or inserts only the named items that are missing). The password is hashed with bcrypt before saving.

## 3. Verify the new data

```powershell
npm run diagnose:data
```

You should see one owner account and menu items in the selected database. Orders and reviews remain at zero until real customers create them.

## 4. Start both apps

From `server`:

```powershell
npm run dev
```

In another terminal, from `client`:

```powershell
npm install
npm run dev
```

Open the URL printed by Vite. Sign in via `/owner/login` with the email/password used above.
