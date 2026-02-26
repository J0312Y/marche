-- ═══════════════════════════════════════════════════════════════
-- LAMUKA MARKET — BASE DE DONNÉES MySQL
-- Multi-commerce marketplace · Brazzaville, Congo 🇨🇬
-- CodeIgniter 3 · PHP 7.4+
-- Par Lamuka Tech © 2026
-- ═══════════════════════════════════════════════════════════════

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `lamuka_market`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `lamuka_market`;

-- ═══════════════════════════════════════
-- 1. UTILISATEURS & AUTHENTIFICATION
-- ═══════════════════════════════════════

CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) UNIQUE DEFAULT NULL COMMENT '+242XXXXXXXXX',
  `email` VARCHAR(191) UNIQUE DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `avatar` VARCHAR(500) DEFAULT NULL,
  `gender` ENUM('M','F','other') DEFAULT NULL,
  `birth_date` DATE DEFAULT NULL,
  `role` ENUM('client','vendor','driver','both','admin') DEFAULT 'client',
  `status` ENUM('active','suspended','banned','pending') DEFAULT 'active',
  `lang` VARCHAR(5) DEFAULT 'fr',
  `currency` VARCHAR(5) DEFAULT 'XAF',
  `fcm_token` VARCHAR(500) DEFAULT NULL COMMENT 'Firebase push token',
  `last_login` DATETIME DEFAULT NULL,
  `email_verified_at` DATETIME DEFAULT NULL,
  `phone_verified_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_phone` (`phone`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB;

CREATE TABLE `otp_codes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(6) NOT NULL,
  `type` ENUM('login','register','reset') DEFAULT 'login',
  `attempts` TINYINT UNSIGNED DEFAULT 0,
  `verified` TINYINT(1) DEFAULT 0,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_phone_code` (`phone`, `code`),
  INDEX `idx_expires` (`expires_at`)
) ENGINE=InnoDB;

CREATE TABLE `social_accounts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `provider` ENUM('google','apple','facebook') NOT NULL,
  `provider_id` VARCHAR(255) NOT NULL,
  `provider_email` VARCHAR(191) DEFAULT NULL,
  `provider_name` VARCHAR(255) DEFAULT NULL,
  `provider_avatar` VARCHAR(500) DEFAULT NULL,
  `access_token` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_provider` (`provider`, `provider_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `sessions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  `device_info` VARCHAR(255) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `expires_at` DATETIME NOT NULL,
  `last_activity` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_token` (`token`(191)),
  INDEX `idx_user_active` (`user_id`, `is_active`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 2. ADRESSES UTILISATEUR
-- ═══════════════════════════════════════

CREATE TABLE `addresses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `label` VARCHAR(50) NOT NULL COMMENT 'Maison, Bureau, etc.',
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) DEFAULT 'Brazzaville',
  `quarter` VARCHAR(100) DEFAULT NULL COMMENT 'Quartier',
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `instructions` TEXT DEFAULT NULL COMMENT 'Instructions livraison',
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 3. CATÉGORIES
-- ═══════════════════════════════════════

CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `icon` VARCHAR(50) DEFAULT NULL COMMENT 'Emoji ou nom icône',
  `image` VARCHAR(500) DEFAULT NULL,
  `parent_id` INT UNSIGNED DEFAULT NULL,
  `commerce_type` ENUM('restaurant','patisserie','supermarche','pharmacie','boutique','service','all') DEFAULT 'all',
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_parent` (`parent_id`),
  INDEX `idx_type` (`commerce_type`),
  INDEX `idx_slug` (`slug`),
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 4. ÉTABLISSEMENTS (COMMERÇANTS)
-- ═══════════════════════════════════════

CREATE TABLE `establishments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `owner_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `type` ENUM('restaurant','patisserie','supermarche','pharmacie','boutique','service') NOT NULL,
  `plan` ENUM('starter','pro','enterprise') DEFAULT 'starter',
  `avatar` VARCHAR(500) DEFAULT NULL,
  `cover_image` VARCHAR(500) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(191) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT 'Brazzaville',
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `rating` DECIMAL(2,1) DEFAULT 0.0,
  `total_reviews` INT UNSIGNED DEFAULT 0,
  `total_orders` INT UNSIGNED DEFAULT 0,
  `followers_count` INT UNSIGNED DEFAULT 0,
  `is_verified` TINYINT(1) DEFAULT 0,
  `is_open` TINYINT(1) DEFAULT 1,
  `eta_min` INT DEFAULT NULL COMMENT 'Temps livraison min (minutes)',
  `eta_max` INT DEFAULT NULL COMMENT 'Temps livraison max (minutes)',
  `min_order` INT UNSIGNED DEFAULT 0 COMMENT 'Commande minimum FCFA',
  `delivery_fee` INT UNSIGNED DEFAULT 0 COMMENT 'Frais livraison FCFA',
  `commission_rate` DECIMAL(4,2) DEFAULT 10.00 COMMENT '% commission Lamuka',
  `status` ENUM('active','pending','suspended','rejected') DEFAULT 'pending',
  `approved_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_owner` (`owner_id`),
  INDEX `idx_type` (`type`),
  INDEX `idx_plan` (`plan`),
  INDEX `idx_status` (`status`),
  INDEX `idx_rating` (`rating`),
  INDEX `idx_location` (`latitude`, `longitude`),
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `establishment_hours` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `establishment_id` INT UNSIGNED NOT NULL,
  `day` TINYINT UNSIGNED NOT NULL COMMENT '0=Lundi, 6=Dimanche',
  `open_time` TIME DEFAULT NULL,
  `close_time` TIME DEFAULT NULL,
  `is_closed` TINYINT(1) DEFAULT 0,
  FOREIGN KEY (`establishment_id`) REFERENCES `establishments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `establishment_team` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `establishment_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `role` ENUM('manager','employee','cashier') DEFAULT 'employee',
  `status` ENUM('active','invited','removed') DEFAULT 'invited',
  `invited_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `joined_at` DATETIME DEFAULT NULL,
  UNIQUE KEY `uk_estab_user` (`establishment_id`, `user_id`),
  FOREIGN KEY (`establishment_id`) REFERENCES `establishments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 5. ARTICLES (PRODUITS)
-- ═══════════════════════════════════════

CREATE TABLE `articles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `establishment_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` INT UNSIGNED NOT NULL COMMENT 'Prix en FCFA',
  `old_price` INT UNSIGNED DEFAULT NULL COMMENT 'Ancien prix (promo)',
  `sku` VARCHAR(50) DEFAULT NULL,
  `stock` INT DEFAULT -1 COMMENT '-1 = illimité',
  `unit` VARCHAR(30) DEFAULT NULL COMMENT 'kg, pièce, portion...',
  `image` VARCHAR(500) DEFAULT NULL,
  `tags` JSON DEFAULT NULL COMMENT '["Best-seller","Nouveau"]',
  `attributes` JSON DEFAULT NULL COMMENT '{"taille":"M","couleur":"rouge"}',
  `is_active` TINYINT(1) DEFAULT 1,
  `is_featured` TINYINT(1) DEFAULT 0,
  `rating` DECIMAL(2,1) DEFAULT 0.0,
  `total_reviews` INT UNSIGNED DEFAULT 0,
  `total_sold` INT UNSIGNED DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_establishment` (`establishment_id`),
  INDEX `idx_category` (`category_id`),
  INDEX `idx_price` (`price`),
  INDEX `idx_rating` (`rating`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_featured` (`is_featured`),
  FULLTEXT INDEX `ft_search` (`name`, `description`),
  FOREIGN KEY (`establishment_id`) REFERENCES `establishments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE `article_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `article_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `sort_order` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 6. FAVORIS
-- ═══════════════════════════════════════

CREATE TABLE `favorites` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `article_id` INT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_article` (`user_id`, `article_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 7. AVIS / REVIEWS
-- ═══════════════════════════════════════

CREATE TABLE `reviews` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `article_id` INT UNSIGNED DEFAULT NULL,
  `establishment_id` INT UNSIGNED DEFAULT NULL,
  `order_id` INT UNSIGNED DEFAULT NULL,
  `rating` TINYINT UNSIGNED NOT NULL COMMENT '1-5',
  `comment` TEXT DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `is_verified_purchase` TINYINT(1) DEFAULT 0,
  `status` ENUM('published','pending','rejected') DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_article` (`article_id`),
  INDEX `idx_establishment` (`establishment_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_rating` (`rating`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`establishment_id`) REFERENCES `establishments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 8. PANIER
-- ═══════════════════════════════════════

CREATE TABLE `cart_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `article_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED DEFAULT 1,
  `note` VARCHAR(255) DEFAULT NULL COMMENT 'Instructions spéciales',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_article` (`user_id`, `article_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 9. COMMANDES
-- ═══════════════════════════════════════

CREATE TABLE `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ref` VARCHAR(30) NOT NULL UNIQUE COMMENT '#LMK-2026-XXXX',
  `user_id` INT UNSIGNED NOT NULL,
  `establishment_id` INT UNSIGNED NOT NULL,
  `driver_id` INT UNSIGNED DEFAULT NULL,
  `address_id` INT UNSIGNED DEFAULT NULL,
  `delivery_address` VARCHAR(255) DEFAULT NULL,
  `delivery_lat` DECIMAL(10,7) DEFAULT NULL,
  `delivery_lng` DECIMAL(10,7) DEFAULT NULL,
  `subtotal` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Sous-total FCFA',
  `delivery_fee` INT UNSIGNED DEFAULT 0,
  `discount` INT UNSIGNED DEFAULT 0,
  `total` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total FCFA',
  `coupon_id` INT UNSIGNED DEFAULT NULL,
  `payment_method` ENUM('airtel','mtn','kolo','cash') NOT NULL,
  `payment_status` ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_ref` VARCHAR(100) DEFAULT NULL COMMENT 'Réf transaction Mobile Money',
  `status` ENUM('pending','confirmed','preparing','ready','picked_up','delivering','delivered','cancelled','refunded') DEFAULT 'pending',
  `note` TEXT DEFAULT NULL,
  `estimated_delivery` DATETIME DEFAULT NULL,
  `confirmed_at` DATETIME DEFAULT NULL,
  `preparing_at` DATETIME DEFAULT NULL,
  `ready_at` DATETIME DEFAULT NULL,
  `picked_up_at` DATETIME DEFAULT NULL,
  `delivered_at` DATETIME DEFAULT NULL,
  `cancelled_at` DATETIME DEFAULT NULL,
  `cancel_reason` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_establishment` (`establishment_id`),
  INDEX `idx_driver` (`driver_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_payment` (`payment_status`),
  INDEX `idx_ref` (`ref`),
  INDEX `idx_created` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`establishment_id`) REFERENCES `establishments`(`id`),
  FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE `order_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `article_id` INT UNSIGNED NOT NULL,
  `article_name` VARCHAR(255) NOT NULL COMMENT 'Snapshot nom au moment commande',
  `article_price` INT UNSIGNED NOT NULL COMMENT 'Snapshot prix',
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `subtotal` INT UNSIGNED NOT NULL,
  `note` VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`)
) ENGINE=InnoDB;

CREATE TABLE `order_tracking` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `message` VARCHAR(255) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_order` (`order_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 10. PAIEMENTS
-- ═══════════════════════════════════════

CREATE TABLE `payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED DEFAULT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `amount` INT UNSIGNED NOT NULL COMMENT 'Montant FCFA',
  `method` ENUM('airtel','mtn','kolo','cash') NOT NULL,
  `type` ENUM('order_payment','wallet_topup','withdrawal','refund') DEFAULT 'order_payment',
  `status` ENUM('pending','processing','completed','failed','cancelled') DEFAULT 'pending',
  `provider_ref` VARCHAR(100) DEFAULT NULL COMMENT 'Réf Airtel/MTN/Kolo',
  `phone_number` VARCHAR(20) DEFAULT NULL COMMENT 'Numéro payeur',
  `metadata` JSON DEFAULT NULL,
  `completed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order` (`order_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_provider_ref` (`provider_ref`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 11. PORTEFEUILLE (WALLET)
-- ═══════════════════════════════════════

CREATE TABLE `wallets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `balance` INT UNSIGNED DEFAULT 0 COMMENT 'Solde FCFA',
  `total_earned` INT UNSIGNED DEFAULT 0,
  `total_withdrawn` INT UNSIGNED DEFAULT 0,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `wallet_transactions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `wallet_id` INT UNSIGNED NOT NULL,
  `type` ENUM('credit','debit') NOT NULL,
  `amount` INT UNSIGNED NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `reference` VARCHAR(100) DEFAULT NULL COMMENT 'order_id ou payment_id',
  `balance_after` INT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_wallet` (`wallet_id`),
  INDEX `idx_created` (`created_at`),
  FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 12. COUPONS / CODES PROMO
-- ═══════════════════════════════════════

CREATE TABLE `coupons` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `establishment_id` INT UNSIGNED DEFAULT NULL COMMENT 'NULL = coupon global',
  `type` ENUM('percentage','fixed','free_delivery') NOT NULL,
  `value` INT UNSIGNED NOT NULL COMMENT '% ou montant FCFA',
  `description` VARCHAR(255) DEFAULT NULL,
  `min_order` INT UNSIGNED DEFAULT 0,
  `max_discount` INT UNSIGNED DEFAULT NULL COMMENT 'Plafond réduction',
  `max_uses` INT UNSIGNED DEFAULT NULL COMMENT 'NULL = illimité',
  `used_count` INT UNSIGNED DEFAULT 0,
  `per_user_limit` INT UNSIGNED DEFAULT 1,
  `starts_at` DATETIME DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_code` (`code`),
  INDEX `idx_establishment` (`establishment_id`),
  INDEX `idx_expires` (`expires_at`),
  FOREIGN KEY (`establishment_id`) REFERENCES `establishments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `coupon_usages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `coupon_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `order_id` INT UNSIGNED NOT NULL,
  `discount_amount` INT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_coupon_user` (`coupon_id`, `user_id`),
  FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`)
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 13. LIVREURS
-- ═══════════════════════════════════════

CREATE TABLE `driver_profiles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `vehicle_type` ENUM('moto','voiture','velo','pied') DEFAULT 'moto',
  `vehicle_plate` VARCHAR(20) DEFAULT NULL,
  `vehicle_brand` VARCHAR(100) DEFAULT NULL,
  `license_number` VARCHAR(50) DEFAULT NULL,
  `id_card_front` VARCHAR(500) DEFAULT NULL,
  `id_card_back` VARCHAR(500) DEFAULT NULL,
  `license_photo` VARCHAR(500) DEFAULT NULL,
  `is_available` TINYINT(1) DEFAULT 0,
  `is_online` TINYINT(1) DEFAULT 0,
  `current_lat` DECIMAL(10,7) DEFAULT NULL,
  `current_lng` DECIMAL(10,7) DEFAULT NULL,
  `total_deliveries` INT UNSIGNED DEFAULT 0,
  `total_earned` INT UNSIGNED DEFAULT 0,
  `avg_rating` DECIMAL(2,1) DEFAULT 0.0,
  `status` ENUM('active','pending','suspended','rejected') DEFAULT 'pending',
  `approved_at` DATETIME DEFAULT NULL,
  `last_location_update` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_available` (`is_available`, `is_online`),
  INDEX `idx_location` (`current_lat`, `current_lng`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `driver_zones` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `driver_id` INT UNSIGNED NOT NULL,
  `zone_name` VARCHAR(100) NOT NULL COMMENT 'Bacongo, Makélékélé, etc.',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_driver` (`driver_id`),
  FOREIGN KEY (`driver_id`) REFERENCES `driver_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `deliveries` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `driver_id` INT UNSIGNED DEFAULT NULL,
  `pickup_address` VARCHAR(255) DEFAULT NULL,
  `pickup_lat` DECIMAL(10,7) DEFAULT NULL,
  `pickup_lng` DECIMAL(10,7) DEFAULT NULL,
  `dropoff_address` VARCHAR(255) DEFAULT NULL,
  `dropoff_lat` DECIMAL(10,7) DEFAULT NULL,
  `dropoff_lng` DECIMAL(10,7) DEFAULT NULL,
  `distance_km` DECIMAL(6,2) DEFAULT NULL,
  `fee` INT UNSIGNED DEFAULT 0,
  `driver_earning` INT UNSIGNED DEFAULT 0,
  `status` ENUM('pending','assigned','pickup_arrived','picked_up','delivering','delivered','cancelled') DEFAULT 'pending',
  `pickup_code` VARCHAR(6) DEFAULT NULL COMMENT 'Code confirmation retrait',
  `delivery_code` VARCHAR(6) DEFAULT NULL COMMENT 'Code confirmation livraison',
  `assigned_at` DATETIME DEFAULT NULL,
  `picked_up_at` DATETIME DEFAULT NULL,
  `delivered_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order` (`order_id`),
  INDEX `idx_driver` (`driver_id`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  FOREIGN KEY (`driver_id`) REFERENCES `driver_profiles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 14. CHAT / MESSAGERIE
-- ═══════════════════════════════════════

CREATE TABLE `conversations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('client_vendor','client_driver','vendor_driver') NOT NULL,
  `order_id` INT UNSIGNED DEFAULT NULL,
  `participant_1` INT UNSIGNED NOT NULL,
  `participant_2` INT UNSIGNED NOT NULL,
  `last_message` VARCHAR(255) DEFAULT NULL,
  `last_message_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_participants` (`participant_1`, `participant_2`),
  INDEX `idx_order` (`order_id`),
  FOREIGN KEY (`participant_1`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`participant_2`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE `messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT UNSIGNED NOT NULL,
  `sender_id` INT UNSIGNED NOT NULL,
  `content` TEXT NOT NULL,
  `type` ENUM('text','image','location','file') DEFAULT 'text',
  `file_url` VARCHAR(500) DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `read_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_conversation` (`conversation_id`, `created_at`),
  INDEX `idx_sender` (`sender_id`),
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 15. NOTIFICATIONS
-- ═══════════════════════════════════════

CREATE TABLE `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('order','delivery','promo','review','system','chat') NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `body` TEXT NOT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `data` JSON DEFAULT NULL COMMENT '{"order_id":123}',
  `is_read` TINYINT(1) DEFAULT 0,
  `read_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_read` (`user_id`, `is_read`),
  INDEX `idx_created` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 16. VENTES FLASH
-- ═══════════════════════════════════════

CREATE TABLE `flash_sales` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `article_id` INT UNSIGNED NOT NULL,
  `flash_price` INT UNSIGNED NOT NULL,
  `stock_limit` INT UNSIGNED DEFAULT NULL,
  `sold_count` INT UNSIGNED DEFAULT 0,
  `starts_at` DATETIME NOT NULL,
  `ends_at` DATETIME NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_dates` (`starts_at`, `ends_at`),
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 17. ZONES DE LIVRAISON
-- ═══════════════════════════════════════

CREATE TABLE `delivery_zones` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) DEFAULT 'Brazzaville',
  `polygon` JSON DEFAULT NULL COMMENT 'GeoJSON coordinates',
  `base_fee` INT UNSIGNED DEFAULT 1000 COMMENT 'Frais base FCFA',
  `per_km_fee` INT UNSIGNED DEFAULT 500 COMMENT 'Frais/km FCFA',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 18. RAPPORTS & STATISTIQUES (LOGS)
-- ═══════════════════════════════════════

CREATE TABLE `activity_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) DEFAULT NULL COMMENT 'order, article, user...',
  `entity_id` INT UNSIGNED DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_action` (`action`),
  INDEX `idx_entity` (`entity_type`, `entity_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- 19. PARAMÈTRES SYSTÈME
-- ═══════════════════════════════════════

CREATE TABLE `settings` (
  `key` VARCHAR(100) PRIMARY KEY,
  `value` TEXT NOT NULL,
  `group` VARCHAR(50) DEFAULT 'general',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ═══════════════════════════════════════
-- DONNÉES INITIALES
-- ═══════════════════════════════════════

INSERT INTO `settings` (`key`, `value`, `group`) VALUES
('app_name', 'Lamuka Market', 'general'),
('app_version', '1.0.0', 'general'),
('currency', 'XAF', 'general'),
('currency_symbol', 'FCFA', 'general'),
('default_lang', 'fr', 'general'),
('commission_rate', '10', 'business'),
('min_withdrawal', '5000', 'business'),
('otp_expiry_minutes', '10', 'auth'),
('max_otp_attempts', '5', 'auth'),
('delivery_base_fee', '1000', 'delivery'),
('delivery_per_km', '500', 'delivery'),
('driver_commission', '80', 'delivery'),
('starter_max_articles', '50', 'plans'),
('starter_max_shops', '1', 'plans'),
('pro_max_articles', '500', 'plans'),
('pro_max_shops', '3', 'plans'),
('enterprise_max_articles', '0', 'plans'),
('enterprise_max_shops', '10', 'plans');

INSERT INTO `categories` (`name`, `slug`, `icon`, `commerce_type`, `sort_order`) VALUES
('Électronique', 'electronique', '📱', 'boutique', 1),
('Mode', 'mode', '👗', 'boutique', 2),
('Restaurants', 'restaurants', '🍽️', 'restaurant', 3),
('Pâtisseries', 'patisseries', '🧁', 'patisserie', 4),
('Supermarchés', 'supermarches', '🛒', 'supermarche', 5),
('Pharmacie', 'pharmacie', '💊', 'pharmacie', 6),
('Beauté', 'beaute', '💄', 'boutique', 7),
('Alimentation', 'alimentation', '🍎', 'supermarche', 8),
('Services', 'services', '🔧', 'service', 9),
('Maison', 'maison', '🏠', 'boutique', 10);

INSERT INTO `delivery_zones` (`name`, `city`, `base_fee`, `per_km_fee`) VALUES
('Bacongo', 'Brazzaville', 1000, 500),
('Makélékélé', 'Brazzaville', 1000, 500),
('Poto-Poto', 'Brazzaville', 1000, 500),
('Moungali', 'Brazzaville', 1200, 500),
('Ouenzé', 'Brazzaville', 1200, 500),
('Talangaï', 'Brazzaville', 1500, 600),
('Mfilou', 'Brazzaville', 1500, 600),
('Madibou', 'Brazzaville', 1800, 700),
('Djiri', 'Brazzaville', 2000, 800);

SET FOREIGN_KEY_CHECKS = 1;

-- ═══════════════════════════════════════
-- RÉSUMÉ : 24 TABLES
-- ═══════════════════════════════════════
-- users, otp_codes, social_accounts, sessions
-- addresses
-- categories
-- establishments, establishment_hours, establishment_team
-- articles, article_images
-- favorites
-- reviews
-- cart_items
-- orders, order_items, order_tracking
-- payments
-- wallets, wallet_transactions
-- coupons, coupon_usages
-- driver_profiles, driver_zones, deliveries
-- conversations, messages
-- notifications
-- flash_sales
-- delivery_zones
-- activity_logs
-- settings
-- ═══════════════════════════════════════
