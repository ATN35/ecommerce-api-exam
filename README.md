# ============================================
# Makefile – E-commerce API (Express + Postgres + Redis)
# Repo : ecommerce-api-exam
# ============================================

PROJECT_NAME := ecommerce-api-exam
COMPOSE      := docker compose
ENV_FILE     := .env

VPS_HOST     := 51.91.9.200
VPS_USER     := ubuntu
SSH          := ssh $(VPS_USER)@$(VPS_HOST)

# --------------------------------------------
# Aide
# --------------------------------------------
.PHONY: help
help:
	@echo ""
	@echo "Commandes disponibles :"
	@echo "  make init        - Copier .env.example vers .env si .env n'existe pas"
	@echo "  make build       - Construire l'image Docker de l'API"
	@echo "  make up          - Lancer l'API + Postgres + Redis en arrière-plan"
	@echo "  make down        - Arrêter et supprimer les conteneurs"
	@echo "  make restart     - Redémarrer proprement les conteneurs"
	@echo "  make ps          - Lister les conteneurs du projet"
	@echo "  make logs        - Voir les logs de l'API"
	@echo "  make logs-all    - Voir les logs de tous les services"
	@echo "  make seed        - Exécuter le script de seed (création admin, données de test)"
	@echo "  make health      - Tester l'endpoint /api/health en local"
	@echo "  make deploy      - git push sur main (déclenche GitHub Actions -> VPS)"
	@echo ""

# --------------------------------------------
# Initialisation
# --------------------------------------------
.PHONY: init
init:
	@if [ ! -f $(ENV_FILE) ]; then \
		cp .env.example $(ENV_FILE); \
		echo "[OK] .env créé à partir de .env.example"; \
	else \
		echo "[INFO] .env existe déjà, rien à faire."; \
	fi

# --------------------------------------------
# Docker (local ou VPS, selon où tu lances make)
# --------------------------------------------
.PHONY: build
build:
	$(COMPOSE) build

.PHONY: up
up:
	$(COMPOSE) up -d

.PHONY: down
down:
	$(COMPOSE) down

.PHONY: restart
restart: down up

.PHONY: ps
ps:
	$(COMPOSE) ps

.PHONY: logs
logs:
	$(COMPOSE) logs -f api

.PHONY: logs-all
logs-all:
	$(COMPOSE) logs -f

# --------------------------------------------
# Seed & tests simples
# --------------------------------------------
.PHONY: seed
seed:
	$(COMPOSE) exec api node backend/src/seed.js

.PHONY: health
health:
	@echo "Test http://localhost:8080/api/health"
	@curl -s -o /dev/null -w "Code HTTP: %{http_code}\n" http://localhost:8080/api/health || echo "Échec de la requête"

# --------------------------------------------
# Déploiement via GitHub Actions
# --------------------------------------------
.PHONY: deploy
deploy:
	@git status
	@echo ""
	@echo "==> Commit & push vers main (déclenche le workflow GitHub Actions)…"
	@git add .
	@git commit -m "chore: deploy API to VPS" || echo "[INFO] Aucun changement à committer."
	@git push origin main
	@echo ""
	@echo "[OK] Push envoyé. GitHub Actions va déployer sur le VPS."
