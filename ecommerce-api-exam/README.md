# E-commerce API – Express.js + PostgreSQL + Redis

## 🚀 Fonctionnalités
- Authentification (register/login), JWT (header Bearer ou cookie optionnel `?cookie=1`), rôles `user`/`admin`
- Produits : CRUD (CRUD admin), liste publique
- Panier : stocké dans Redis (ajout, maj quantité, vider)
- Commandes : création à partir du panier, décrément du stock
- RGPD : consentement cookies, suppression de compte
- Santé : `/api/health`, `/api/health/db`, `/api/health/redis`
- Sécurité : Helmet, CORS, cookies HttpOnly optionnels, Bcrypt
- Architecture MVC légère (routes → controllers → models/services)
- Docker + docker-compose pour dev & déploiement
- Postman collection fournie (`tests/postman_collection.json`)

## 🧱 Arborescence
```
ecommerce-api-express-postgres-redis/
├─ backend/
│  ├─ Dockerfile
│  ├─ package.json
│  └─ src/
│     ├─ app.js, server.js
│     ├─ config/ (db.js, redis.js)
│     ├─ controllers/ (auth|products|cart|orders|health|rgpd)
│     ├─ middlewares/ (security|auth|error)
│     ├─ models/ (users|products|orders)
│     ├─ routes/ (auth|products|cart|orders|health|rgpd)
│     └─ services/ (cartService.js)
├─ database/init.sql
├─ docker-compose.yml
├─ .env.example
├─ package.json
└─ tests/postman_collection.json
```

## ⚙️ Démarrage (Docker)
1. Copie `.env.example` → `.env` et ajuste si besoin.
2. `docker compose up --build -d`
3. API sur `http://localhost:8080` — PG sur `localhost:5432` — Redis `localhost:6379`
4. Admin par défaut : `admin@local.test` (pass: `admin123` – voir note seed).

> Note : L’init SQL insère un hash `bcrypt` pour `admin123`.

## 🔐 Flux démo
- `POST /api/auth/register` → créer compte
- `POST /api/auth/login` → token JWT
- `GET /api/products` → catalogue
- `POST /api/cart/add` (Bearer token) → ajouter produit
- `POST /api/orders` (Bearer token) → valider commande
- Admin : `POST/PUT/DELETE /api/products/:id`

## 🔎 Santé
- `GET /api/health`
- `GET /api/health/db`
- `GET /api/health/redis`

## 🧪 Tests Postman
Importer `tests/postman_collection.json`. Variable `baseUrl` déjà définie.
Renseigner `{{token}}` après login pour les requêtes protégées.

## 🛡️ RGPD
- Consentement : `POST /api/rgpd/consent` (body `{consent: true|false}`)
- Droit à l'effacement : `DELETE /api/rgpd/account`

## 📦 Déploiement VPS (prod rapide)
- Définir `NODE_ENV=production`, `CORS_ORIGIN` sur vos domaines.
- Option : Ajouter un reverse-proxy (Caddy/Traefik/Nginx) pour TLS.
- `docker compose pull && docker compose up -d --build`

## 📘 Notes
- Le panier est TTL 24h dans Redis.
- Les prix sont en centimes pour éviter les flottants.
- Le stock est décrémenté à la création de commande (BEGIN/COMMIT).
