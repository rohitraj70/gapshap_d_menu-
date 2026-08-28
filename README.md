# Gapshap Cafe — QR Smart Menu

A mobile-first digital menu for Gapshap Cafe, built on the MERN stack. Customers scan a table QR code, browse the menu, build a "My Selection" list, and show it at the counter — no online payment, no customer login. The owner manages the whole menu from a JWT-protected admin panel.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion + Lucide icons
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (admin only)
- **Images:** Cloudinary

## Project structure

```
gapshap-cafe/
├── server/            Express API
│   ├── config/db.js
│   ├── models/         User, Category, MenuItem
│   ├── controllers/    auth, category, menu
│   ├── routes/         auth, category, menu
│   ├── middleware/      JWT protect, error handler
│   ├── utils/           cloudinary, token
│   ├── seed/createAdmin.js   one-time admin creation script
│   └── server.js
├── client/            React app
│   └── src/
│       ├── components/   Navbar, SearchBar, CategoryTabs, FoodCard, FavoriteButton, AdminSidebar, ...
│       ├── pages/         Home, FoodDetails, Favorites, admin/*
│       ├── context/       FavoritesContext (localStorage), AuthContext (JWT)
│       └── services/api.js
├── render.yaml         Render deploy blueprint for the API
└── README.md
```

## Local setup

### 1. Backend

```bash
cd server
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, Cloudinary keys
npm install
npm run dev             # http://localhost:5001
```

Create your first admin user (there's no public sign-up UI on purpose):

```bash
node seed/createAdmin.js
```

### 2. Frontend

```bash
cd client
cp .env.example .env   # VITE_API_URL=http://localhost:5001/api
npm install
npm run dev             # http://localhost:5173
```

Visit `http://localhost:5173` for the customer menu and `http://localhost:5173/admin/login` for the admin panel.

## API reference

### Public
| Method | Route | Description |
|---|---|---|
| GET | `/api/categories` | List categories |
| GET | `/api/menu` | List menu items — supports `?search=`, `?category=`, `?featured=`, `?available=` |
| GET | `/api/menu/:id` | Single menu item |
| GET | `/api/menu/category/:categoryId` | Items in a category |

### Admin (Bearer token required)
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Get a JWT |
| GET | `/api/auth/me` | Current admin profile |
| POST / PUT / DELETE | `/api/categories(/:id)` | Manage categories |
| POST / PUT / DELETE | `/api/menu(/:id)` | Manage menu items (multipart form for image upload) |

## How favorites work

The customer's "My Selection" list lives entirely in `localStorage` via `FavoritesContext` — nothing is sent to the server, since there's no online ordering. The floating button, badge count, and estimated total all derive from that same context, so they stay in sync everywhere in the app.

## Deployment

- **Frontend → Vercel:** import the `client/` folder as the project root, set `VITE_API_URL` to your deployed API URL. `vercel.json` handles SPA routing so deep links like `/food/:id` work on refresh.
- **Backend → Render:** `render.yaml` at the repo root defines a Node web service rooted at `server/`. Set `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, and `CLIENT_URL` (your Vercel URL) as environment variables in the Render dashboard.
- **Database → MongoDB Atlas:** create a free cluster, add your Render service's IP (or `0.0.0.0/0` for simplicity) to the network access list, and use the connection string as `MONGO_URI`.
- **Images → Cloudinary:** create a free account, grab your cloud name/API key/secret from the dashboard, and set them as backend env vars — uploads go straight from the admin panel to Cloudinary via `multer-storage-cloudinary`.

## Design tokens

| Token | Value |
|---|---|
| Background | `#FFF8F0` |
| Primary brown | `#6F4E37` |
| Accent orange | `#E67E22` |
| Display font | Fraunces |
| Body font | Manrope |
