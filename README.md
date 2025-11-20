# ��� API e-Commerce – Projet d’Examen DWWM
API sécurisée permettant la gestion complète d’un système e-commerce : utilisateurs, administrateurs, produits, commandes, authentification, base de données persistante et déploiement VPS via Docker & Nginx.

---

## ��� Objectif du projet
Réaliser une API professionnelle conforme aux compétences du titre DWWM :
- Backend structuré avec architecture MVC  
- Authentification sécurisée (JWT, Bcrypt)  
- Gestion des rôles (user/admin)  
- CRUD complet sur les produits  
- Création et gestion des commandes  
- Base de données SQL persistante  
- Déploiement sécurisé (Docker, Nginx, HTTPS, VPS)

---

## ��� Stack Technique
- **Node.js / Express.js**
- **PostgreSQL** (volume Docker persistant)
- **JWT, Bcrypt, CORS, Helmet**
- **Docker & Docker Compose**
- **Nginx** (reverse proxy + TLS)
- **Ubuntu 22.04 sur VPS**

---

## ��� Architecture MVC
/src
├── controllers
├── models
├── routes
├── middlewares
└── utils

---

## ���️ Étapes de création du projet

### 1️⃣ Initialisation du backend
- Création d’un projet Express propre  
- Mise en place de la structure MVC  
- Configuration de Docker  
- Configuration de docker-compose avec :
  - service API  
  - service PostgreSQL  
  - volume pour la persistance des données

---

### 2️⃣ Système d’authentification sécurisé
- Inscription avec hachage **Bcrypt**  
- Connexion générant un **JWT**  
- Middleware pour valider les tokens  
- Système de rôle : utilisateur / administrateur

---

### 3️⃣ Gestion des produits (CRUD)
- **Admin :** créer, modifier, supprimer  
- **Utilisateur :** consulter les produits  
- Vérification du token pour les opérations sensibles  

---

### 4️⃣ Gestion des commandes
- Création de commande par utilisateur  
- Vérification des droits et de l’authentification  
- Association des commandes avec les produits  

---

### 5️⃣ Déploiement sur VPS Ubuntu
- Clonage du projet sur le serveur  
- Installation de Docker + Docker Compose  
- Mise en place d’un **Nginx reverse proxy**  
- Activation du HTTPS  
- API servie derrière Nginx sur port 443  
- Base PostgreSQL persistante via volume Docker  

---

## ✔️ Résultat final
Une API e-commerce **sécurisée, modulaire, documentée et déployée**, prête pour un usage réel et conforme aux attentes du jury DWWM :  
- Authentification complète  
- Gestion des données fiable  
- Architecture professionnelle  
- Sécurité renforcée  
- Déploiement automatisable  

---

## ��� Auteur
**Antoine Lelièvre** – Développeur Web & Web Mobile  

