<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

/*
|--------------------------------------------------------------------------
| API v1 Routes
|--------------------------------------------------------------------------
| Format: api/v1/{controller}/{method}
| CI3 gère automatiquement via le dossier controllers/api/v1/
|
| Exemples d'URLs :
| POST /api/v1/auth/send_otp
| GET  /api/v1/articles
| GET  /api/v1/articles/detail/5
| POST /api/v1/orders/create
| GET  /api/v1/vendor/dashboard
| PUT  /api/v1/driver/location/update
|--------------------------------------------------------------------------
*/

// Auth
$route['api/v1/auth/send-otp']          = 'api/v1/auth/send_otp';
$route['api/v1/auth/verify-otp']        = 'api/v1/auth/verify_otp';
$route['api/v1/auth/social']            = 'api/v1/auth/social';
$route['api/v1/auth/complete-profile']   = 'api/v1/auth/complete_profile';
$route['api/v1/auth/logout']            = 'api/v1/auth/logout';
$route['api/v1/auth/refresh']           = 'api/v1/auth/refresh';

// Users
$route['api/v1/users/me']              = 'api/v1/users/me';
$route['api/v1/users/password']         = 'api/v1/users/password';
$route['api/v1/users/avatar']           = 'api/v1/users/avatar';

// Categories
$route['api/v1/categories']             = 'api/v1/categories/index';
$route['api/v1/categories/(:num)']      = 'api/v1/categories/detail/$1';

// Establishments
$route['api/v1/establishments']                  = 'api/v1/establishments/index';
$route['api/v1/establishments/nearby']            = 'api/v1/establishments/nearby';
$route['api/v1/establishments/(:num)']            = 'api/v1/establishments/detail/$1';
$route['api/v1/establishments/(:num)/articles']   = 'api/v1/establishments/articles/$1';

// Articles
$route['api/v1/articles']               = 'api/v1/articles/index';
$route['api/v1/articles/popular']       = 'api/v1/articles/popular';
$route['api/v1/articles/flash']         = 'api/v1/articles/flash';
$route['api/v1/articles/(:num)']        = 'api/v1/articles/detail/$1';

// Favorites
$route['api/v1/favorites']              = 'api/v1/favorites/index';
$route['api/v1/favorites/toggle/(:num)'] = 'api/v1/favorites/toggle/$1';

// Reviews
$route['api/v1/reviews']                = 'api/v1/reviews/index';
$route['api/v1/reviews/stats/(:num)']   = 'api/v1/reviews/stats/$1';

// Cart
$route['api/v1/cart']                   = 'api/v1/cart/index';
$route['api/v1/cart/count']             = 'api/v1/cart/count';
$route['api/v1/cart/(:num)']            = 'api/v1/cart/item/$1';

// Orders
$route['api/v1/orders']                 = 'api/v1/orders/index';
$route['api/v1/orders/(:num)']          = 'api/v1/orders/detail/$1';
$route['api/v1/orders/(:num)/cancel']   = 'api/v1/orders/cancel/$1';
$route['api/v1/orders/(:num)/track']    = 'api/v1/orders/track/$1';

// Payments
$route['api/v1/payments/initiate']      = 'api/v1/payments/initiate';
$route['api/v1/payments/callback']      = 'api/v1/payments/callback';
$route['api/v1/payments/(:num)/status'] = 'api/v1/payments/status/$1';

// Wallets
$route['api/v1/wallets/balance']        = 'api/v1/wallets/balance';
$route['api/v1/wallets/topup']          = 'api/v1/wallets/topup';
$route['api/v1/wallets/withdraw']       = 'api/v1/wallets/withdraw';
$route['api/v1/wallets/transactions']   = 'api/v1/wallets/transactions';

// Coupons
$route['api/v1/coupons']               = 'api/v1/coupons/index';
$route['api/v1/coupons/verify']        = 'api/v1/coupons/verify';

// Addresses
$route['api/v1/addresses']              = 'api/v1/addresses/index';
$route['api/v1/addresses/(:num)']       = 'api/v1/addresses/item/$1';
$route['api/v1/addresses/(:num)/default'] = 'api/v1/addresses/set_default/$1';

// Chat
$route['api/v1/chat/conversations']     = 'api/v1/chat/conversations';
$route['api/v1/chat/(:num)/messages']   = 'api/v1/chat/messages/$1';
$route['api/v1/chat/(:num)/send']       = 'api/v1/chat/send/$1';
$route['api/v1/chat/(:num)/read']       = 'api/v1/chat/mark_read/$1';

// Notifications
$route['api/v1/notifications']              = 'api/v1/notifications/index';
$route['api/v1/notifications/count']        = 'api/v1/notifications/count';
$route['api/v1/notifications/(:num)/read']  = 'api/v1/notifications/read/$1';
$route['api/v1/notifications/read-all']     = 'api/v1/notifications/read_all';

// === VENDOR ROUTES ===
$route['api/v1/vendor/register']            = 'api/v1/vendor/dashboard/register';
$route['api/v1/vendor/dashboard']           = 'api/v1/vendor/dashboard/index';
$route['api/v1/vendor/orders']              = 'api/v1/vendor/orders/index';
$route['api/v1/vendor/orders/(:num)']       = 'api/v1/vendor/orders/detail/$1';
$route['api/v1/vendor/orders/(:num)/status'] = 'api/v1/vendor/orders/update_status/$1';
$route['api/v1/vendor/articles']            = 'api/v1/vendor/articles/index';
$route['api/v1/vendor/articles/(:num)']     = 'api/v1/vendor/articles/item/$1';
$route['api/v1/vendor/promos']              = 'api/v1/vendor/promos/index';
$route['api/v1/vendor/promos/(:num)']       = 'api/v1/vendor/promos/item/$1';
$route['api/v1/vendor/deliveries']          = 'api/v1/vendor/delivery/index';
$route['api/v1/vendor/deliveries/(:num)/assign'] = 'api/v1/vendor/delivery/assign/$1';
$route['api/v1/vendor/deliveries/(:num)/track']  = 'api/v1/vendor/delivery/track/$1';
$route['api/v1/vendor/team']                = 'api/v1/vendor/team/index';
$route['api/v1/vendor/team/invite']         = 'api/v1/vendor/team/invite';
$route['api/v1/vendor/team/(:num)']         = 'api/v1/vendor/team/remove/$1';
$route['api/v1/vendor/shops']               = 'api/v1/vendor/shops/index';
$route['api/v1/vendor/shops/(:num)']        = 'api/v1/vendor/shops/item/$1';
$route['api/v1/vendor/wallet']              = 'api/v1/vendor/wallet/index';
$route['api/v1/vendor/wallet/withdraw']     = 'api/v1/vendor/wallet/withdraw';
$route['api/v1/vendor/reports']             = 'api/v1/vendor/reports/index';
$route['api/v1/vendor/reviews']             = 'api/v1/vendor/reviews/index';
$route['api/v1/vendor/settings']            = 'api/v1/vendor/settings/index';

// === DRIVER ROUTES ===
$route['api/v1/driver/register']            = 'api/v1/driver/dashboard/register';
$route['api/v1/driver/dashboard']           = 'api/v1/driver/dashboard/index';
$route['api/v1/driver/deliveries']          = 'api/v1/driver/deliveries/index';
$route['api/v1/driver/deliveries/(:num)/accept']  = 'api/v1/driver/deliveries/accept/$1';
$route['api/v1/driver/deliveries/(:num)/pickup']  = 'api/v1/driver/deliveries/pickup/$1';
$route['api/v1/driver/deliveries/(:num)/deliver'] = 'api/v1/driver/deliveries/deliver/$1';
$route['api/v1/driver/location']            = 'api/v1/driver/location/update';
$route['api/v1/driver/availability']        = 'api/v1/driver/location/availability';
$route['api/v1/driver/zones']               = 'api/v1/driver/zones/index';
$route['api/v1/driver/zones/(:num)']        = 'api/v1/driver/zones/item/$1';
$route['api/v1/driver/vehicle']             = 'api/v1/driver/vehicle/index';
$route['api/v1/driver/wallet']              = 'api/v1/driver/wallet/index';
$route['api/v1/driver/wallet/withdraw']     = 'api/v1/driver/wallet/withdraw';
$route['api/v1/driver/stats']               = 'api/v1/driver/stats/index';
$route['api/v1/driver/history']             = 'api/v1/driver/deliveries/history';
