<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * JWT Configuration — Lamuka Market
 */
$config['jwt_secret']       = 'LamukaTech2026!JWT@Congo#SecretKey$BZV';
$config['jwt_algorithm']    = 'HS256';
$config['jwt_expiry']       = 86400 * 30; // 30 jours en secondes
$config['jwt_refresh_expiry'] = 86400 * 90; // 90 jours
$config['jwt_issuer']       = 'lamuka-market-api';

/**
 * OTP Config
 */
$config['otp_length']       = 6;
$config['otp_expiry']       = 10; // minutes
$config['otp_max_attempts'] = 5;

/**
 * Upload Config
 */
$config['upload_max_size']  = 5120; // 5MB en KB
$config['upload_path']      = FCPATH . 'uploads/';
$config['allowed_types']    = 'jpg|jpeg|png|webp';

/**
 * Mobile Money Config
 */
$config['airtel_api_url']   = 'https://openapi.airtel.africa';
$config['airtel_client_id'] = ''; // À remplir
$config['airtel_secret']    = ''; // À remplir
$config['mtn_api_url']      = 'https://sandbox.momodeveloper.mtn.com';
$config['mtn_subscription_key'] = ''; // À remplir
$config['kolo_api_url']     = ''; // API Kolo Pay interne

/**
 * Firebase Push
 */
$config['firebase_server_key'] = ''; // À remplir
$config['firebase_api_url']    = 'https://fcm.googleapis.com/fcm/send';

/**
 * Plans limits
 */
$config['plans'] = array(
    'starter' => array(
        'max_articles' => 50,
        'max_shops'    => 1,
        'analytics'    => false,
        'team'         => false,
        'api_access'   => false,
        'priority_support' => false,
    ),
    'pro' => array(
        'max_articles' => 500,
        'max_shops'    => 3,
        'analytics'    => true,
        'team'         => false,
        'api_access'   => false,
        'priority_support' => true,
    ),
    'enterprise' => array(
        'max_articles' => 0, // illimité
        'max_shops'    => 10,
        'analytics'    => true,
        'team'         => true,
        'api_access'   => true,
        'priority_support' => true,
    ),
);
