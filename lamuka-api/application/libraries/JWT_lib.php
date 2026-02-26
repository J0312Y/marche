<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * JWT_lib — JSON Web Token Library
 * Lamuka Market · CodeIgniter 3
 *
 * Implémentation JWT pure PHP (pas de dépendance externe).
 * Compatible PHP 7.4+
 */
class JWT_lib
{
    private $CI;
    private $secret;
    private $algorithm;
    private $expiry;
    private $issuer;

    public function __construct()
    {
        $this->CI =& get_instance();
        $this->secret    = $this->CI->config->item('jwt_secret');
        $this->algorithm = $this->CI->config->item('jwt_algorithm') ?: 'HS256';
        $this->expiry    = $this->CI->config->item('jwt_expiry') ?: 86400 * 30;
        $this->issuer    = $this->CI->config->item('jwt_issuer') ?: 'lamuka-api';
    }

    /**
     * Générer un token JWT
     *
     * @param int   $user_id
     * @param array $extra  Données supplémentaires dans le payload
     * @return string Token JWT
     */
    public function encode($user_id, $extra = array())
    {
        $now = time();

        $header = array(
            'typ' => 'JWT',
            'alg' => $this->algorithm,
        );

        $payload = array_merge(array(
            'iss'     => $this->issuer,
            'iat'     => $now,
            'exp'     => $now + $this->expiry,
            'user_id' => (int) $user_id,
        ), $extra);

        $segments = array(
            $this->_base64url_encode(json_encode($header)),
            $this->_base64url_encode(json_encode($payload)),
        );

        $signing_input = implode('.', $segments);
        $signature = $this->_sign($signing_input);
        $segments[] = $this->_base64url_encode($signature);

        return implode('.', $segments);
    }

    /**
     * Décoder et vérifier un token JWT
     *
     * @param string $token
     * @return object|false Payload ou false si invalide
     */
    public function decode($token)
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return false;
        }

        list($header_b64, $payload_b64, $sig_b64) = $parts;

        // Vérifier la signature
        $signing_input = $header_b64 . '.' . $payload_b64;
        $signature = $this->_base64url_decode($sig_b64);
        $expected = $this->_sign($signing_input);

        if (!hash_equals($expected, $signature)) {
            return false;
        }

        // Décoder le payload
        $payload = json_decode($this->_base64url_decode($payload_b64));

        if (!$payload) {
            return false;
        }

        // Vérifier l'expiration
        if (isset($payload->exp) && $payload->exp < time()) {
            return false;
        }

        // Vérifier l'émetteur
        if (isset($payload->iss) && $payload->iss !== $this->issuer) {
            return false;
        }

        return $payload;
    }

    /**
     * Extraire le payload sans vérifier (pour debug)
     */
    public function payload($token)
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;
        return json_decode($this->_base64url_decode($parts[1]));
    }

    /**
     * Vérifier si un token est expiré
     */
    public function is_expired($token)
    {
        $payload = $this->payload($token);
        if (!$payload || !isset($payload->exp)) return true;
        return $payload->exp < time();
    }

    // ─────────────────────────────
    // Private helpers
    // ─────────────────────────────

    private function _sign($data)
    {
        return hash_hmac('sha256', $data, $this->secret, true);
    }

    private function _base64url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function _base64url_decode($data)
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
