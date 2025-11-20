###############################################################
#                                                             #
#     Ì∫Ä E-commerce API ‚Äî Express.js + PostgreSQL + Redis     #
#     Ì≥¶ D√©ploiement Docker + GitHub Actions + VPS OVH        #
#                                                             #
###############################################################

# === COULEURS TERMINAL ===
YELLOW  = \033[1;33m
GREEN   = \033[1;32m
CYAN    = \033[1;36m
BLUE    = \033[1;34m
RESET   = \033[0m

# === VARIABLES ==================================================
PROJECT      = ecommerce-api-exam
COMPOSE      = docker compose
ENV_FILE     = .env
VPS_HOST     = 51.91.9.200
VPS_USER     = ubuntu
VPS_PATH     = /home/ubuntu/apps/$(PROJECT)

default: help


###############################################################
# ÔøΩÔøΩ AIDE ‚Äî DOCUMENTATION / README
###############################################################
help:
	@echo ""
	@echo "$(CYAN)============== Ìºê  E-COMMERCE API ‚Äî README ============== $(RESET)"
	@echo ""
	@echo "$(GREEN)Ì≥å Technologies utilis√©es :$(RESET)"
	@echo "  - Node.js + Express"
	@echo "  - PostgreSQL (persistant)"
	@echo "  - Redis (panier TTL)"
	@echo "  - JWT, Bcrypt, CORS, Helmet"
	@echo "  - Docker & docker-compose"
	@echo "  - GitHub Actions (d√©ploiement CI/CD)"
	@echo "  - VPS OVH"
	@echo ""
	@echo "$(GREEN)Ì≥¶ Fonctionnalit√©s API :$(RESET)"
	@echo "  - Authentification (register/login), JWT + cookie HttpOnly"
	@echo "  - Produits : CRUD admin + consultation publique"
	@echo "  - Panier avec Redis"
	@echo "  - Commandes : cr√©ation + d√©cr√©ment stock"
	@echo "  - Routes sant√© : /api/health, /db, /redis"
	@echo "  - RGPD : consentement + suppression de compte"
	@echo ""
	@echo "$(GREEN)Ìª†Ô∏è Commandes Makefile disponibles :$(RESET)"
	@echo ""
	@echo "$(YELLOW)  make init         $(RESET)‚Üí initialise .env si absent"
	@echo "$(YELLOW)  make build        $(RESET)‚Üí build des conteneurs Docker"
	@echo "$(YELLOW)  make up           $(RESET)‚Üí lance l‚Äôenvironnement (detached)"
	@echo "$(YELLOW)  make logs         $(RESET)‚Üí affiche les logs live"
	@echo "$(YELLOW)  make down        $(RESET)‚Üí stop + supprime conteneurs"
	@echo "$(YELLOW)  make restart     $(RESET)‚Üí restart complet"
	@echo "$(YELLOW)  make test-api    $(RESET)‚Üí test /api/health"
	@echo ""
	@echo "$(BLUE)  make deploy      $(RESET)‚Üí push GitHub ‚Üí d√©ploiement automatique"
	@echo ""
	@echo "$(CYAN)==========================================================$(RESET)"
	@echo ""


###############################################################
# Ì¥ß INITIALISATION
###############################################################
init:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "$(YELLOW)[INIT]$(RESET) Cr√©ation du fichier .env..."; \
		cp .env.example .env; \
	else \
		echo "$(GREEN)[OK]$(RESET) Fichier .env d√©j√† existant."; \
	fi


###############################################################
# Ì∞≥ DOCKER ‚Äî LOCAL DEV
###############################################################
build:
	@echo "$(BLUE)[BUILD]$(RESET) Construction backend..."
	$(COMPOSE) build

up:
	@echo "$(GREEN)[UP]$(RESET) Lancement des services..."
	$(COMPOSE) up -d

down:
	@echo "$(YELLOW)[DOWN]$(RESET) Extinction des services..."
	$(COMPOSE) down --remove-orphans

restart: down up

logs:
	$(COMPOSE) logs -f


###############################################################
# Ì∑™ TEST RAPIDE DE L‚ÄôAPI
###############################################################
test-api:
	@echo "$(CYAN)Test ‚Üí http://localhost:8080/api/health$(RESET)"
	curl -s http://localhost:8080/api/health | jq


###############################################################
# Ì∫Ä DEPLOIEMENT (Automatique via GitHub Actions)
###############################################################
deploy:
	@echo ""
	@echo "$(GREEN)======================================================$(RESET)"
	@echo "$(GREEN)     Ì∫Ä D√©ploiement via PUSH ‚Üí branche main            $(RESET)"
	@echo "$(GREEN)======================================================$(RESET)"
	@echo ""
	@echo "$(CYAN)‚û°Ô∏è  Commit + push tes modifications :$(RESET)"
	@echo "   git add ."
	@echo "   git commit -m \"deploy\""
	@echo "   git push origin main"
	@echo ""
	@echo "$(BLUE)Le VPS ex√©cutera automatiquement :$(RESET)"
	@echo "   - copie des fichiers"
	@echo "   - rebuild Docker"
	@echo "   - red√©marrage API"
	@echo ""
	@echo "$(GREEN)Ìºç URL de production : http://$(VPS_HOST)$(RESET)"
