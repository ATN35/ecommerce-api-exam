# ============================================================
#  Makefile – E-commerce API (Express.js + PostgreSQL + Redis)
# ============================================================
#
#  Repo : ecommerce-api-exam
#
#  Backend :
#    - Node.js / Express
#    - PostgreSQL + Redis (docker-compose)
#    - Auth JWT (user/admin), Bcrypt, Helmet, CORS
#    - Panier dans Redis, commandes, RGPD (consentement / delete)
#    - Endpoints de santé : /api/health, /api/health/db, /api/health/redis
#
#  Ce Makefile sert de “mini README” :
#    - `make help`   : affiche les commandes disponibles
#    - `make init`   : prépare le fichier .env
#    - `make build`  : build des images Docker
#    - `make up`     : lance la stack en détaché
#    - `make down`   : arrête et supprime les conteneurs
#    - `make logs`   : suit les logs de l’API
#    - `make health` : ping des endpoints de santé
#    - `make deploy` : push sur main (déclenche GitHub Actions)
#
# ============================================================

# ----- Configuration locale --------------------------------------------------

# Dossier du projet contenant docker-compose.yml
PROJECT_DIR      := ecommerce-api-exam

# Fichiers d'environnement
ENV_EXAMPLE      := $(PROJECT_DIR)/.env.example
ENV_FILE         := $(PROJECT_DIR)/.env

# Commande docker compose
COMPOSE          := docker compose -f $(PROJECT_DIR)/docker-compose.yml

# Branche principale pour le déploiement
BRANCH           := main

# -----------------------------------------------------------------------------


# Cible par défaut : affiche l'aide
.PHONY: help
help:
	@echo ""
	@echo "Commandes Make disponibles :"
	@echo "  make help      - Afficher cette aide"
	@echo "  make init      - Créer .env à partir de .env.example si nécessaire"
	@echo "  make build     - Builder les images Docker (API, Postgres, Redis)"
	@echo "  make up        - Démarrer la stack en arrière-plan"
	@echo "  make down      - Arrêter et nettoyer les conteneurs"
	@echo "  make logs      - Voir les logs de l'API"
	@echo "  make ps        - Lister les conteneurs du projet"
	@echo "  make health    - Tester les endpoints /api/health*"
	@echo "  make deploy    - Git add/commit/push sur la branche '$(BRANCH)'"
	@echo ""


# ----- Initialisation --------------------------------------------------------

.PHONY: init
init:
	@if [ ! -f "$(ENV_FILE)" ]; then \
	  echo "[init] $(ENV_FILE) manquant, copie depuis $(ENV_EXAMPLE)"; \
	  cp "$(ENV_EXAMPLE)" "$(ENV_FILE)"; \
	else \
	  echo "[init] $(ENV_FILE) existe déjà, rien à faire."; \
	fi


# ----- Docker : build / up / down / logs / ps --------------------------------

.PHONY: build
build:
	@echo "[docker] Build des images…"
	@$(COMPOSE) build

.PHONY: up
up:
	@echo "[docker] Démarrage de la stack…"
	@$(COMPOSE) up -d

.PHONY: down
down:
	@echo "[docker] Arrêt et nettoyage…"
	@$(COMPOSE) down

.PHONY: logs
logs:
	@echo "[docker] Logs de l'API (Ctrl+C pour quitter)…"
	@$(COMPOSE) logs -f api

.PHONY: ps
ps:
	@$(COMPOSE) ps


# ----- Santé de l'API --------------------------------------------------------

.PHONY: health
health:
	@echo "[health] /api/health"
	@curl -sS http://localhost:8080/api/health || true
	@echo "\n[health] /api/health/db"
	@curl -sS http://localhost:8080/api/health/db || true
	@echo "\n[health] /api/health/redis"
	@curl -sS http://localhost:8080/api/health/redis || true
	@echo ""


# ----- Déploiement (Git + GitHub Actions) ------------------------------------

.PHONY: deploy
deploy:
	@echo "[deploy] Ajout des fichiers modifiés…"
	@git add .
	@echo "[deploy] Commit (laisse vide pour annuler)…"
	@git commit -m "chore: update ecommerce api" || true
	@echo "[deploy] Push sur $(BRANCH)…"
	@git push origin $(BRANCH)
	@echo "[deploy] Terminé. GitHub Actions se charge du déploiement sur le VPS."

