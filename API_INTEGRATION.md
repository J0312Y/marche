# 🔌 LAMUKA MARKET — Guide d'Intégration API

## Architecture

```
src/
├── api/                    ← 🆕 Couche API (21 fichiers)
│   ├── client.js           ← HTTP client + JWT + error handling
│   ├── auth.js             ← OTP, Social, Profile
│   ├── users.js            ← Profil utilisateur
│   ├── categories.js       ← Catégories
│   ├── establishments.js   ← Établissements
│   ├── articles.js         ← Articles/Produits
│   ├── favorites.js        ← Favoris
│   ├── reviews.js          ← Avis
│   ├── cart.js             ← Panier
│   ├── orders.js           ← Commandes
│   ├── payments.js         ← Paiements Mobile Money
│   ├── wallets.js          ← Portefeuille
│   ├── coupons.js          ← Codes promo
│   ├── addresses.js        ← Adresses de livraison
│   ├── chat.js             ← Messagerie
│   ├── notifications.js    ← Notifications
│   ├── followers.js        ← Follow/Unfollow
│   ├── search.js           ← Historique recherche
│   ├── driverReviews.js    ← Notes livreurs
│   ├── vendor.js           ← API Vendeur (toutes routes)
│   ├── driver.js           ← API Livreur (toutes routes)
│   └── index.js            ← Barrel export
├── hooks/                  ← 🆕 Hooks React (6 fichiers)
│   ├── useApi.js           ← useApi, useMutation, useInfiniteApi
│   ├── useCart.js           ← Panier synchronisé
│   ├── useFavorites.js      ← Favoris synchronisés
│   ├── useNotifications.js  ← Notifications + badge count
│   ├── useFollowers.js      ← Follow/Unfollow
│   └── index.js
├── context/                ← 🆕 Context React
│   └── AuthContext.jsx      ← Auth state global
└── .env                    ← VITE_API_URL
```

---

## 1️⃣ Setup — Envelopper l'App

```jsx
// main.jsx
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AuthProvider>
);
```

---

## 2️⃣ Auth — Connecter les écrans d'authentification

### LoginScr.jsx — Envoi OTP
```jsx
import { authApi } from '../../api';

// Dans le handler du bouton "Recevoir le code"
const handleSendOtp = async () => {
  setLoading(true);
  try {
    await authApi.sendOtp(phone);
    onDone(); // → OTPScr
  } catch (err) {
    setError(err.message);
  } finally { setLoading(false); }
};

// Login social
const handleSocial = async (provider) => {
  setLoading(true);
  try {
    // Ici intégrer le SDK du provider (Google, Apple, Facebook)
    const providerData = await getProviderToken(provider);
    const result = await authApi.social(provider, providerData);
    authApi.saveAuth(result);
    if (result.is_new) onSocial(provider); // → ProfileCompletion
    else onDone(); // → Home
  } catch (err) { setError(err.message); }
};
```

### OTPScr.jsx — Vérification
```jsx
import { authApi } from '../../api';

const handleVerify = async () => {
  try {
    const result = await authApi.verifyOtp(phone, code);
    authApi.saveAuth(result);
    if (result.is_new) onDone(); // → ProfileCompletion
    else onDone(); // → Home (skip profile)
  } catch (err) { setError(err.message); }
};
```

### ProfileCompletionScr.jsx
```jsx
import { authApi } from '../../api';

const handleComplete = async () => {
  try {
    await authApi.completeProfile({ first_name, last_name, email, gender });
    onDone(); // → Home
  } catch (err) { setError(err.message); }
};
```

---

## 3️⃣ Home — Données dynamiques

### HomeScr.jsx
```jsx
import { categoriesApi, articlesApi, establishmentsApi } from '../../api';
import { useApi } from '../../hooks';

// Remplacer les imports statiques :
// ❌ import { CATS, VENDORS, P } from '../../data';

// ✅ Charger depuis l'API :
const { data: categories, loading: catLoading } = useApi(categoriesApi.getAll);
const { data: popular, loading: popLoading } = useApi(articlesApi.getPopular);
const { data: flashSales } = useApi(articlesApi.getFlash);

// Pour les vendeurs proches (si GPS disponible) :
const [nearby, setNearby] = useState([]);
useEffect(() => {
  navigator.geolocation?.getCurrentPosition(async (pos) => {
    const data = await establishmentsApi.getNearby(pos.coords.latitude, pos.coords.longitude);
    setNearby(data);
  });
}, []);
```

---

## 4️⃣ Recherche — SearchScr.jsx
```jsx
import { articlesApi, searchApi } from '../../api';
import { useMutation } from '../../hooks';

const [results, setResults] = useState([]);
const [query, setQuery] = useState('');

const handleSearch = async () => {
  if (!query.trim()) return;
  const data = await articlesApi.search({
    search: query,
    type: selectedType,
    category_id: selectedCat,
    sort: sortBy,
    min_price: priceRange[0],
    max_price: priceRange[1],
  });
  setResults(data.articles || []);
  // Logger l'historique
  searchApi.addRecentlyViewed && searchApi.getHistory();
};
```

---

## 5️⃣ Panier — CartScr.jsx
```jsx
import { useCart } from '../../hooks';

// Dans App.jsx ou le parent :
const cartHook = useCart();

// Passer au composant :
<CartScr
  cart={cartHook.items}
  onUpdateQty={cartHook.updateQty}
  onRemove={cartHook.remove}
  onClear={cartHook.clear}
  subtotal={cartHook.subtotal}
/>

// Pour ajouter (depuis DetailScr) :
<DetailScr onAddCart={(product, qty) => cartHook.add(product, qty)} />
```

---

## 6️⃣ Commandes — CheckoutScr → OrdersScr → TrackingScr
```jsx
// CheckoutScr.jsx — Créer la commande
import { ordersApi, paymentsApi, couponsApi } from '../../api';

const handleOrder = async () => {
  // 1. Vérifier coupon si saisi
  let discount = 0;
  if (couponCode) {
    const couponResult = await couponsApi.verify(couponCode, subtotal);
    discount = couponResult.discount;
  }

  // 2. Créer la commande
  const order = await ordersApi.create({
    address_id: selectedAddress.id,
    payment_method: paymentMethod, // 'airtel' | 'mtn' | 'kolo'
    coupon_code: couponCode,
    note: note,
  });

  // 3. Initier le paiement
  if (paymentMethod !== 'cash') {
    await paymentsApi.initiate(order.order_ids[0], paymentMethod, phone);
  }

  // 4. Rediriger
  go('orderDetail', { id: order.order_ids[0] });
};

// OrdersScr.jsx — Liste des commandes
const { data: orders, loading } = useApi(() => ordersApi.getAll(statusFilter));

// TrackingScr.jsx — Suivi en temps réel
const { data, execute: refresh } = useApi(() => ordersApi.track(orderId));
useEffect(() => {
  const interval = setInterval(refresh, 10000); // Refresh toutes les 10s
  return () => clearInterval(interval);
}, [orderId]);
```

---

## 7️⃣ Favoris
```jsx
// Dans App.jsx :
import { useFavorites } from './hooks';
const favHook = useFavorites();

// Passer aux composants :
<HomeScr
  favs={favHook.favs}
  toggleFav={favHook.toggle}
  isFav={favHook.isFav}
/>
```

---

## 8️⃣ Chat — ChatListScr → ChatScr
```jsx
import { chatApi } from '../../api';
import { useApi } from '../../hooks';

// ChatListScr — Liste des conversations
const { data: conversations } = useApi(chatApi.getConversations);

// ChatScr — Messages d'une conversation
const { data: messages } = useApi(() => chatApi.getMessages(convId));

const sendMessage = async (text) => {
  await chatApi.send(convId, text);
  // Refresh messages
};
```

---

## 9️⃣ Vendor Mode
```jsx
import { vendorApi } from '../../api';

// Dashboard
const { data: dashboard } = useApi(() => vendorApi.getDashboard('month'));

// Commandes vendeur
const { data: orders } = useApi(() => vendorApi.orders.getAll(statusFilter));

// Confirmer/préparer une commande
await vendorApi.orders.updateStatus(orderId, 'confirmed');
await vendorApi.orders.updateStatus(orderId, 'preparing');
await vendorApi.orders.updateStatus(orderId, 'ready');

// Ajouter un article
await vendorApi.articles.create({
  name: 'Poulet DG',
  price: 5500,
  category_id: 3,
  description: 'Poulet DG avec plantains',
});

// Gérer l'équipe (Enterprise)
await vendorApi.team.invite('+242069999999', 'employee');
```

---

## 🔟 Driver Mode
```jsx
import { driverApi } from '../../api';

// Dashboard
const { data: dashboard } = useApi(driverApi.getDashboard);

// Livraisons disponibles
const { data: available } = useApi(driverApi.deliveries.getAvailable);

// Accepter une livraison
await driverApi.deliveries.accept(deliveryId);

// Retrait avec code
await driverApi.deliveries.pickup(deliveryId, pickupCode);

// Livraison avec code
await driverApi.deliveries.deliver(deliveryId, deliveryCode);

// MAJ position GPS (toutes les 30s)
useEffect(() => {
  const watchId = navigator.geolocation.watchPosition((pos) => {
    driverApi.location.update(pos.coords.latitude, pos.coords.longitude);
  });
  return () => navigator.geolocation.clearWatch(watchId);
}, []);
```

---

## Mapping Data Statique → API

| Ancien (data/)          | Nouveau (api/)                          |
|-------------------------|-----------------------------------------|
| `CATS`                  | `categoriesApi.getAll()`                |
| `VENDORS`               | `establishmentsApi.getAll()`            |
| `P` (products)          | `articlesApi.search()` / `.getPopular()`|
| `COUPONS`               | `couponsApi.getAll()`                   |
| `NOTIFS`                | `notificationsApi.getAll()`             |
| `REVIEWS`               | `reviewsApi.getByArticle(id)`           |
| `ADDRS`                 | `addressesApi.getAll()`                 |
| `CHATS`                 | `chatApi.getConversations()`            |
| `V_ORDERS`              | `vendorApi.orders.getAll()`             |
| `V_PRODUCTS`            | `vendorApi.articles.getAll()`           |
| `V_WALLET`              | `vendorApi.wallet.get()`                |
| `V_REVIEWS`             | `vendorApi.reviews.getAll()`            |
| `V_PROMOS`              | `vendorApi.promos.getAll()`             |
| `V_STATS`               | `vendorApi.reports.get()`               |
| `D_DELIVERIES`          | `driverApi.deliveries.getAvailable()`   |
| `D_HISTORY`             | `driverApi.deliveries.getHistory()`     |
| `D_STATS`               | `driverApi.stats.get()`                 |

---

## Structure d'une Réponse API

```json
{
  "success": true,
  "message": "Succès",
  "data": { ... }
}
```

Les erreurs :
```json
{
  "success": false,
  "message": "Champs requis manquants : phone",
  "errors": ["phone"]
}
```
