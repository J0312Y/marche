<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Reference Helper — Lamuka Market
 * Génération de codes et références
 */

/**
 * Générer un code OTP à 6 chiffres
 */
if (!function_exists('generate_otp')) {
    function generate_otp($length = 6)
    {
        $min = pow(10, $length - 1);
        $max = pow(10, $length) - 1;
        return (string) random_int($min, $max);
    }
}

/**
 * Générer une référence de commande : LMK-2026-XXXX
 */
if (!function_exists('generate_order_ref')) {
    function generate_order_ref()
    {
        $year = date('Y');
        $random = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
        return "LMK-{$year}-{$random}";
    }
}

/**
 * Générer un code de livraison (pickup/delivery) à 6 chiffres
 */
if (!function_exists('generate_delivery_code')) {
    function generate_delivery_code()
    {
        return generate_otp(6);
    }
}

/**
 * Générer un token unique
 */
if (!function_exists('generate_token')) {
    function generate_token($length = 64)
    {
        return bin2hex(random_bytes($length / 2));
    }
}

/**
 * Générer un slug unique
 */
if (!function_exists('generate_unique_slug')) {
    function generate_unique_slug($text, $table, $column = 'slug')
    {
        $CI =& get_instance();
        $slug = slugify($text);
        $original = $slug;
        $counter = 1;

        while ($CI->db->where($column, $slug)->count_all_results($table) > 0) {
            $slug = $original . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
