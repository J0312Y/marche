# 🔄 Guide de Migration — Données Statiques → API

## Architecture

```
src/
├── api/              ← NOUVEAU : Couche API
│   ├── client.js     ← HTTP client avec JWT
│   ├── useApi.js     ← Hooks React (useApi, useAction, useToast)
│   ├── auth.js       ← Authentification
│   ├── articles.js   ← Produits
│   ├── cart.js       ← Panier
│   ├── ...           ← 17 modules au total
│   └── index.js      ← Barrel export
├── context/
│   └── AppContext.jsx ← État global (remplace prop drilling)
├── modes/
│   ├── BuyerScreens.jsx   ← Utilise useApp()
│   ├── VendorScreens.jsx  ← Utilise useApp()
│   └── DriverScreens.jsx  ← Utilise useApp()
```

## Pattern de base : Convertir un Screen

### AVANT (données statiques) :
```jsx
import { P, VENDORS } from "../../data";

function HomeScr({ go }) {
  const products = P;
  const vendors = VENDORS;
  return <div>{products.map(p => ...)}</div>;
}
```

### APRÈS (données API) :
```jsx
import { useApi } from "../../api/useApi";
import { articlesAPI, establishmentsAPI } from "../../api";

function HomeScr({ go }) {
  const { data: products, loading } = useApi(() => articlesAPI.getPopular());
  const { data: vendors } = useApi(() => establishmentsAPI.getAll());

  if (loading) return <div className="loading">Chargement...</div>;
  return <div>{(products || []).map(p => ...)}</div>;
}
```

## Mappings Data → API

| Import Statique | API Équivalent | Module |
|---|---|---|
| `P` (produits) | `articlesAPI.search()` | articles.js |
| `VENDORS` | `establishmentsAPI.getAll()` | establishments.js |
| `CATS` | `categoriesAPI.getAll()` | categories.js |
| `COUPONS` | `couponsAPI.getAll()` | coupons.js |
| `NOTIFS` | `notificationsAPI.getAll()` | notifications.js |
| `REVIEWS` | `reviewsAPI.getByArticle(id)` | reviews.js |
| `ADDRS` | `addressesAPI.getAll()` | addresses.js |
| `CHATS` | `chatAPI.getConversations()` | chat.js |
| `V_ORDERS` | `vendorAPI.orders()` | vendor.js |
| `V_PRODUCTS` | `vendorAPI.articles()` | vendor.js |
| `V_WALLET` | `vendorAPI.wallet()` | vendor.js |
| `V_REVIEWS` | `vendorAPI.reviews()` | vendor.js |
| `V_PROMOS` | `vendorAPI.promos()` | vendor.js |
| `V_STATS` | `vendorAPI.reports()` | vendor.js |
| `D_DELIVERIES` | `driverAPI.available()` | driver.js |
| `D_HISTORY` | `driverAPI.history()` | driver.js |
| `D_STATS` | `driverAPI.stats()` | driver.js |

## Hooks Disponibles

### useApi — Pour les chargements automatiques (GET)
```jsx
const { data, loading, error, reload } = useApi(
  () => articlesAPI.search({ type: 'restaurant' }),
  [type] // dépendances
);
```

### useAction — Pour les actions manuelles (POST/PUT/DELETE)
```jsx
const { run, loading } = useAction();

const handleSubmit = async () => {
  try {
    const order = await run(() => ordersAPI.create({ address_id, payment_method }));
    showToast('Commande passée !');
  } catch (err) {
    showToast(err.message, 'error');
  }
};
```

### useApp — Pour l'état global (Context)
```jsx
import { useApp } from '../../context/AppContext';

function MyScreen() {
  const { user, cart, go, pop, toggleFav, isFav, showToast } = useApp();
}
```

## Screens par Priorité de Migration

### 🔴 Haute (utilisent des données qui doivent être live)
1. HomeScr — categories, articles, establishments
2. CartScr — cart items (déjà via context)
3. OrdersScr — commandes en cours
4. CheckoutScr — création commande + paiement
5. ChatListScr / ChatScr — messages en temps réel
6. NotifScr — notifications

### 🟡 Moyenne
7. SearchScr — recherche articles
8. DetailScr — détail article
9. VendorScr — détail établissement
10. ReviewsScr — avis
11. AddressesScr — adresses
12. ProfileScr / EditProfileScr — profil utilisateur

### 🟢 Basse (peu de données dynamiques)
13. CouponsScr, FlashScr
14. WishlistScr (déjà via context favs)
15. SettingsScr, HelpScr, TermsScr

## Variables d'Environnement

Créer `.env` à la racine du projet :
```
VITE_API_URL=http://localhost:8888/lamuka-api/api/v1
```

Pour la production :
```
VITE_API_URL=https://api.lamukamarket.com/api/v1
```

## Gestion des Images

Les images serveur sont des URLs. Mettre à jour les cards :

```jsx
// AVANT
<div className="cart-img">{product.img}</div>

// APRÈS
{product.image_url
  ? <img src={product.image_url} className="cart-img" />
  : <div className="cart-img">{product.img || '📦'}</div>
}
```

## Structure des Réponses API

Toutes les réponses suivent ce format :
```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

Le `client.js` extrait automatiquement `data`, donc :
```js
const categories = await categoriesAPI.getAll();
// categories = le contenu de data directement
```
