# ============================================================
#  Makefile – E-commerce API (Express.js + PostgreSQL + Redis)
#  Repo : ecommerce-api-exam
# ============================================================

# --------- Couleurs jolies ----------
YELLOW  := \033[1;33m
GREEN   := \033[1;32m
BLUE    := \033[1;36m
PURPLE  := \033[1;35m
RESET   := \033[0m

# --------- Variables projet ----------
PROJECT   := ecommerce-api-exam
COMPOSE   := docker compose
ENV_FILE  := .env
ENV_EXMP  := .env.example

# ============================================================
#  AIDE GLOBALE
# ============================================================
.PHONY: help
help:
	@echo ""
	@echo "$(PURPLE)$(PROJECT)$(RESET) – API e-commerce : Express + PostgreSQL + Redis"
	@echo "$(BLUE)Fonctions :$(RESET) auth JWT, produits, panier Redis, commandes, RGPD, healthchecks."
	@echo ""
	@echo "$(YELLOW)Commandes disponibles :$(RESET)"
	@echo "  make init         $(GREEN)# Initialiser le projet (.env, premier coup d’œil)$(RESET)"
	@echo "  make build        $(GREEN)# Construire les images Docker$(RESET)"
	@echo "  make up           $(GREEN)# Lancer la stack API + Postgres + Redis$(RESET)"
	@echo "  make down         $(GREEN)# Arrêter et nettoyer les conteneurs$(RESET)"
	@echo "  make logs         $(GREEN)# Suivre les logs de l’API$(RESET)"
	@echo "  make ps           $(GREEN)# Voir les conteneurs en cours$(RESET)"
	@echo "  make health       $(GREEN)# Tester rapidement /api/health sur le VPS/local$(RESET)"
	@echo "  make seed         $(GREEN)# (Optionnel) Lancer le seed / init des données$(RESET)"
	@echo "  make deploy       $(GREEN)# Déploiement rapide sur VPS via Docker compose$(RESET)"
	@echo ""

# ============================================================
#  INITIALISATION
# ============================================================
.PHONY: init
init:
	@echo "$(YELLOW)[INIT]$(RESET) Vérification du fichier $(ENV_FILE)…"
	@if [ ! -f "$(ENV_FILE)" ]; then \
		if [ -f "$(ENV_EXMP)" ]; then \
			cp "$(ENV_EXMP)" "$(ENV_FILE)"; \
			echo "$(GREEN)[OK]$(RESET) $(ENV_FILE) créé à partir de $(ENV_EXMP)."; \
		else \
			echo "$(PURPLE)[INFO]$(RESET) Aucun $(ENV_EXMP) trouvé, crée ton $(ENV_FILE) à la main."; \
		fi \
	else \
		echo "$(PURPLE)[INFO]$(RESET) $(ENV_FILE) existe déjà, rien à faire."; \
	fi

# ============================================================
#  DOCKER – LOCAL OU VPS
# ============================================================
.PHONY: build
build:
	@echo "$(YELLOW)[DOCKER]$(RESET) Build des images…"
	@$(COMPOSE) build

.PHONY: up
up:
	@echo "$(YELLOW)[DOCKER]$(RESET) Lancement de la stack en arrière-plan…"
	@$(COMPOSE) up -d
	@echo "$(GREEN)[OK]$(RESET) API dispo sur http://localhost:8080"

.PHONY: down
down:
	@echo "$(YELLOW)[DOCKER]$(RESET) Arrêt et nettoyage des conteneurs…"
	@$(COMPOSE) down

.PHONY: logs
logs:
	@echo "$(YELLOW)[LOGS]$(RESET) Suivi des logs du service API (Ctrl+C pour quitter)…"
	@$(COMPOSE) logs -f api

.PHONY: ps
ps:
	@$(COMPOSE) ps

# ============================================================
#  TEST RAPIDE DE L’API
# ============================================================
.PHONY: health
health:
	@echo "$(YELLOW)[CHECK]$(RESET) GET /api/health"
	@curl -sS http://localhost:8080/api/health || echo "$(PURPLE)API non joignable$(RESET)"

# ============================================================
#  SEED / DONNÉES D’EXEMPLE (SI PRÉVU)
# ============================================================
.PHONY: seed
seed:
	@echo "$(YELLOW)[SEED]$(RESET) Lancement éventuel du seed (à adapter au besoin)…"
	@echo "$(PURPLE)Exemple : node backend/src/seed.js$(RESET)"

# ============================================================
#  DÉPLOIEMENT RAPIDE SUR VPS (MANUEL)
# ============================================================
.PHONY: deploy
deploy:
	@echo "$(YELLOW)[DEPLOY]$(RESET) Déploiement Docker sur le VPS…"
	@echo "$(PURPLE)Étapes recommandées :$(RESET)"
	@echo "  1) git push origin main"
	@echo "  2) sur le VPS :"
	@echo "     cd ~/apps/$(PROJECT)"
	@echo "     $(COMPOSE) pull && $(COMPOSE) up -d --build"
	@echo ""
	@echo "$(GREEN)[TIP]$(RESET) GitHub Actions est déjà prêt pour automatiser ces étapes."
