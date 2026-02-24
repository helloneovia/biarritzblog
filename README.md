# 🛒 StepPrs - Premium Orthopaedic Insoles Store 

Ce projet est une boutique e-commerce premium, mobile-first, développée avec **Next.js 14+ (App Router)** et **Tailwind CSS**. 
Il a été conçu pour maximiser les conversions et optimiser la vitesse de chargement (Core Web Vitals) et le SEO.

## 🚀 Fonctionnalités
- Design système haut de gamme fluide (Framer Motion, Shadcn UI).
- Interface Mobile-first.
- Page produit optimisée avec sélecteur de variantes (tailles) et "Bundles" pour booster l'AOV (Average Order Value).
- Checkout Stripe sécurisé.
- Base de données PostgreSQL via Prisma (Commandes, Stocks, Codes promotionnels).
- Dashboard d'administration simple.
- Intégrations Analytics : Google Analytics 4 (GA4) et Meta Pixel.
- SEO prêt : Schema.org Product (JSON-LD) et balises Meta dynamiques.

---

## 🛠 Prérequis

- **Node.js**: v18.17+
- **Base de données**: PostgreSQL (Local ou cloud, ex: Supabase / Vercel Postgres)
- **Stripe**: Compte Stripe pour les clés API (`STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`)

## ⚙️ Installation & Lancement Local

1.  **Cloner le repository :**
    ```bash
    git clone https://github.com/helloneovia/biarritzblog.git
    cd biarritzblog
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurer l'environnement :**
    Copiez le fichier d'exemple et remplissez-le.
    ```bash
    cp .env.example .env
    ```

    Variables requises :
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/steppprs"
    STRIPE_SECRET_KEY="sk_test_..."
    STRIPE_WEBHOOK_SECRET="whsec_..."
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
    NEXT_PUBLIC_FB_PIXEL_ID="XXXXXXXXXXXXXXX"
    ```

4.  **Initialiser la base de données :**
    ```bash
    npx prisma db push
    ```

5.  **Démarrer en mode développement :**
    ```bash
    npm run dev
    ```
    L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## ☁️ Déploiement sur Ubuntu 24.04 (CloudPanel)

Ce projet inclut un script pré-configuré dans `package.json` pour simplifier le déploiement de production via CI/CD sur CloudPanel. L'application tournera en tâche de fond avec PM2.

1.  Assurez-vous que Node.js et PM2 sont installés globalement sur votre serveur VPS CloudPanel :
    ```bash
    npm install -g pm2
    ```

2.  Une fois le code récupéré sur le serveur (via GitHub Webhooks ou manuellement), rendez-vous dans le dossier de l'app et exécutez le script deploy :
    ```bash
    npm install
    npm run deploy
    ```
    Ce script :
    * Compile l'application Next.js (`npm run build`).
    * Tente de redémarrer le processus PM2 nommé **biarritzblog**. S'il n'existe pas, il le crée.

3. Configurez CloudPanel (Reverse Proxy) :
    * Dans la configuration Vhost Nginx de CloudPanel, pointez le trafic HTTPS/HTTP vers le port local de l'application (par défaut `3000` ou précisé via la variable d'env `PORT`).

---

## 🤝 Contribution & Maintenance

-   Le système de composants UI est géré par **shadcn/ui**. Pour ajouter un composant : `npx shadcn@latest add [composant]`.
-   Le schéma de base de données se trouve dans `prisma/schema.prisma`. N'oubliez pas de générer les migrations après toute modification.
