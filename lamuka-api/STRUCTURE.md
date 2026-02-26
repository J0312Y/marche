lamuka-api/
├── database/
│   └── lamuka_market.sql              ← 24 tables, données initiales
│
├── application/
│   ├── config/
│   │   ├── autoload.php
│   │   ├── config.php
│   │   ├── database.php
│   │   ├── routes.php
│   │   └── jwt.php                    ← Config JWT custom
│   │
│   ├── core/
│   │   └── MY_Controller.php          ← Base controller API (auth, JSON response)
│   │
│   ├── libraries/
│   │   ├── JWT_lib.php                ← Génération/vérification JWT
│   │   ├── OTP_lib.php                ← Envoi SMS OTP (Airtel/MTN)
│   │   ├── Payment_lib.php            ← Mobile Money (Airtel, MTN, Kolo)
│   │   ├── Upload_lib.php             ← Upload images
│   │   ├── Push_lib.php               ← Firebase Cloud Messaging
│   │   └── Geolocation_lib.php        ← Calcul distance, zones
│   │
│   ├── helpers/
│   │   ├── api_helper.php             ← json_response(), format_price()
│   │   └── ref_helper.php             ← generate_order_ref(), generate_otp()
│   │
│   ├── models/
│   │   ├── User_model.php
│   │   ├── Otp_model.php
│   │   ├── Session_model.php
│   │   ├── Address_model.php
│   │   ├── Category_model.php
│   │   ├── Establishment_model.php
│   │   ├── Article_model.php
│   │   ├── Favorite_model.php
│   │   ├── Review_model.php
│   │   ├── Cart_model.php
│   │   ├── Order_model.php
│   │   ├── Payment_model.php
│   │   ├── Wallet_model.php
│   │   ├── Coupon_model.php
│   │   ├── Driver_model.php
│   │   ├── Delivery_model.php
│   │   ├── Conversation_model.php
│   │   ├── Message_model.php
│   │   ├── Notification_model.php
│   │   ├── Flash_sale_model.php
│   │   └── Setting_model.php
│   │
│   └── controllers/
│       └── api/
│           └── v1/
│               ├── Auth.php            ← login, register, otp, social, logout
│               ├── Users.php           ← profile, edit, change password
│               ├── Categories.php      ← list, by type
│               ├── Establishments.php  ← list, detail, by type, nearby
│               ├── Articles.php        ← list, search, detail, by establishment
│               ├── Favorites.php       ← list, toggle
│               ├── Reviews.php         ← list, create
│               ├── Cart.php            ← list, add, update, remove, clear
│               ├── Orders.php          ← create, list, detail, cancel, track
│               ├── Payments.php        ← initiate, callback, status
│               ├── Wallets.php         ← balance, topup, withdraw, history
│               ├── Coupons.php         ← list, verify, apply
│               ├── Addresses.php       ← list, add, edit, delete, set default
│               ├── Chat.php            ← conversations, messages, send
│               ├── Notifications.php   ← list, read, read all
│               ├── Flash_sales.php     ← list active
│               │
│               ├── vendor/
│               │   ├── Dashboard.php   ← stats, revenue, orders summary
│               │   ├── Orders.php      ← list, detail, update status
│               │   ├── Articles.php    ← CRUD articles
│               │   ├── Reviews.php     ← list reviews received
│               │   ├── Promos.php      ← CRUD coupons
│               │   ├── Delivery.php    ← assign driver, track
│               │   ├── Team.php        ← invite, remove, roles
│               │   ├── Shops.php       ← multi-shop CRUD
│               │   ├── Wallet.php      ← balance, withdraw
│               │   ├── Reports.php     ← analytics, revenue, top articles
│               │   └── Settings.php    ← hours, fees, profile
│               │
│               └── driver/
│                   ├── Dashboard.php   ← active deliveries, stats
│                   ├── Deliveries.php  ← accept, pickup, deliver, history
│                   ├── Location.php    ← update GPS position
│                   ├── Zones.php       ← manage zones
│                   ├── Vehicle.php     ← vehicle info
│                   ├── Wallet.php      ← earnings, withdraw
│                   └── Stats.php       ← daily, weekly, monthly
│
├── .htaccess
├── index.php
└── README.md
