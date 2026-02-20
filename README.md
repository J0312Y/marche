# 🏪 Lamuka Market

> Multi-commerce marketplace for Congo 🇨🇬 — **88 composants | 35+ écrans | 3 modes**  
> Built by **Lamuka Tech** — Brazzaville

## 🚀 Quick Start

```bash
npm install
npm run dev     # → http://localhost:3000
npm run build   # → /dist
```

## 📂 Architecture (108 fichiers source)

```
src/
├── App.jsx                      # Router principal + state global
├── main.jsx                     # Entry point
├── data/                        # 🗃️ Mock data (→ remplacer par API)
│   ├── products.js              # 14 articles
│   ├── vendors.js               # 8 commerçants
│   ├── categories.js            # 10 catégories
│   ├── reviews.js / coupons.js / notifications.js / addresses.js / chats.js
│   ├── vendorData.js            # V_ORDERS, V_PRODUCTS, V_WALLET, V_STATS...
│   └── driverData.js            # D_DELIVERIES, D_HISTORY, D_STATS...
├── utils/helpers.js             # fmt() disc()
├── styles/global.js             # CSS complet (520 lignes)
└── screens/
    ├── auth/     (5)  → Splash, Onboarding, Login, OTP, ProfileCompletion
    ├── buyer/    (27) → Home, Search, Detail, Cart, Checkout, Reviews...
    ├── vendor/   (30) → Dashboard, Orders, Products, Delivery, Shops...
    ├── driver/   (15) → Dashboard, Delivery, Navigation, Wallet, Zones...
    └── common/   (5)  → Settings, Help, About, Terms, Privacy
```

## 🔌 Guide intégration API

Chaque fichier `src/data/*.js` → remplacer par appel API :

| Mock file | API endpoint | Méthodes |
|---|---|---|
| products.js | `/api/products` | GET POST PUT DELETE |
| vendors.js | `/api/vendors` | GET |
| categories.js | `/api/categories` | GET |
| reviews.js | `/api/products/:id/reviews` | GET POST |
| vendorData.js | `/api/vendor/*` | GET POST PUT |
| driverData.js | `/api/driver/*` | GET POST PUT |

### Pattern API recommandé
```jsx
// Créer: src/services/api.js
import axios from 'axios';
export const api = axios.create({ baseURL: 'https://api.lamuka.cg' });

// Dans un écran:
import { api } from "../../services/api";
const [products, setProducts] = useState([]);
useEffect(() => { api.get('/products').then(r => setProducts(r.data)) }, []);
```

### Services à créer dans `src/services/`
- `api.js` — Instance Axios de base
- `authService.js` — Phone+OTP, Social login
- `productService.js` — CRUD articles
- `orderService.js` — Commandes
- `paymentService.js` — Airtel Money, MTN MoMo, Kolo Pay
- `chatService.js` — WebSocket temps réel

## 📞 Contact
**Joeldy Tsina** — Lamuka Tech | 📱 +242 064 663 469 | ✉️ joeldytsina94@gmail.com

© 2026 Lamuka Tech
