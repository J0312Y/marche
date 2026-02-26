<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * API Helper — Lamuka Market
 * Fonctions utilitaires globales pour l'API
 */

/**
 * Réponse JSON standard
 */
if (!function_exists('json_response')) {
    function json_response($data, $status = 200)
    {
        $CI =& get_instance();
        $CI->output
            ->set_status_header($status)
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($data, JSON_UNESCAPED_UNICODE));
    }
}

/**
 * Réponse succès
 */
if (!function_exists('json_success')) {
    function json_success($data = null, $message = 'Succès', $status = 200)
    {
        $response = array('success' => true, 'message' => $message);
        if ($data !== null) {
            $response['data'] = $data;
        }
        json_response($response, $status);
    }
}

/**
 * Réponse erreur
 */
if (!function_exists('json_error')) {
    function json_error($message = 'Erreur', $status = 400, $errors = null)
    {
        $response = array('success' => false, 'message' => $message);
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        json_response($response, $status);
    }
}

/**
 * Récupérer le body JSON de la requête
 */
if (!function_exists('get_json_input')) {
    function get_json_input()
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        return is_array($data) ? $data : array();
    }
}

/**
 * Récupérer un champ du body JSON
 */
if (!function_exists('json_input')) {
    function json_input($key, $default = null)
    {
        $data = get_json_input();
        return isset($data[$key]) ? $data[$key] : $default;
    }
}

/**
 * Formater un prix en FCFA
 */
if (!function_exists('format_price')) {
    function format_price($amount)
    {
        return number_format($amount, 0, ',', '.') . ' FCFA';
    }
}

/**
 * Obtenir la méthode HTTP
 */
if (!function_exists('request_method')) {
    function request_method()
    {
        return strtoupper($_SERVER['REQUEST_METHOD']);
    }
}

/**
 * Vérifier que la méthode HTTP est correcte
 */
if (!function_exists('require_method')) {
    function require_method($method)
    {
        if (request_method() !== strtoupper($method)) {
            json_error('Méthode non autorisée', 405);
            return false;
        }
        return true;
    }
}

/**
 * Pagination helper
 */
if (!function_exists('get_pagination')) {
    function get_pagination()
    {
        $CI =& get_instance();
        $page = max(1, (int) $CI->input->get('page', true));
        $limit = min(50, max(1, (int) ($CI->input->get('limit', true) ?: 20)));
        $offset = ($page - 1) * $limit;

        return array(
            'page'   => $page,
            'limit'  => $limit,
            'offset' => $offset,
        );
    }
}

/**
 * Formater la pagination pour la réponse
 */
if (!function_exists('pagination_meta')) {
    function pagination_meta($total, $page, $limit)
    {
        return array(
            'total'       => (int) $total,
            'page'        => (int) $page,
            'limit'       => (int) $limit,
            'total_pages' => (int) ceil($total / $limit),
            'has_more'    => ($page * $limit) < $total,
        );
    }
}

/**
 * Nettoyer une chaîne pour slug
 */
if (!function_exists('slugify')) {
    function slugify($text)
    {
        $text = strtolower(trim($text));
        $text = preg_replace('/[àáâãäå]/', 'a', $text);
        $text = preg_replace('/[èéêë]/', 'e', $text);
        $text = preg_replace('/[ìíîï]/', 'i', $text);
        $text = preg_replace('/[òóôõö]/', 'o', $text);
        $text = preg_replace('/[ùúûü]/', 'u', $text);
        $text = preg_replace('/[ç]/', 'c', $text);
        $text = preg_replace('/[^a-z0-9-]/', '-', $text);
        $text = preg_replace('/-+/', '-', $text);
        return trim($text, '-');
    }
}

/**
 * Obtenir l'IP du client
 */
if (!function_exists('get_client_ip')) {
    function get_client_ip()
    {
        $keys = array('HTTP_X_FORWARDED_FOR', 'HTTP_CLIENT_IP', 'REMOTE_ADDR');
        foreach ($keys as $key) {
            if (!empty($_SERVER[$key])) {
                return explode(',', $_SERVER[$key])[0];
            }
        }
        return '0.0.0.0';
    }
}
