<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * OTP_lib — Envoi de SMS OTP
 * Lamuka Market · CodeIgniter 3
 *
 * Supporte : Airtel Congo, MTN Congo
 * Détecte le réseau automatiquement via le préfixe du numéro.
 */
class OTP_lib
{
    private $CI;

    public function __construct()
    {
        $this->CI =& get_instance();
    }

    /**
     * Envoyer un OTP par SMS
     *
     * @param string $phone   Numéro +242XXXXXXXXX
     * @param string $code    Code OTP
     * @return bool
     */
    public function send($phone, $code)
    {
        $message = "Lamuka Market : Votre code de vérification est {$code}. Valable 10 minutes. Ne le partagez avec personne.";

        $network = $this->detect_network($phone);

        switch ($network) {
            case 'airtel':
                return $this->_send_airtel($phone, $message);
            case 'mtn':
                return $this->_send_mtn($phone, $message);
            default:
                log_message('error', "OTP: Réseau non détecté pour {$phone}");
                return $this->_send_fallback($phone, $message);
        }
    }

    /**
     * Détecter le réseau mobile Congo-Brazzaville
     *
     * Airtel : 05, 04
     * MTN :    06
     *
     * @param string $phone  Format +242XXXXXXXXX ou 06XXXXXXXX
     * @return string airtel|mtn|unknown
     */
    public function detect_network($phone)
    {
        // Normaliser : retirer +242 et espaces
        $clean = preg_replace('/[\s\-\+]/', '', $phone);

        if (strpos($clean, '242') === 0) {
            $clean = substr($clean, 3);
        }

        $prefix = substr($clean, 0, 2);

        if (in_array($prefix, array('05', '04'))) {
            return 'airtel';
        }
        if ($prefix === '06') {
            return 'mtn';
        }

        return 'unknown';
    }

    /**
     * Normaliser un numéro au format +242XXXXXXXXX
     */
    public function normalize_phone($phone)
    {
        $clean = preg_replace('/[\s\-\(\)\+]/', '', $phone);

        if (strpos($clean, '242') === 0) {
            return '+' . $clean;
        }

        if (strlen($clean) === 9 && in_array(substr($clean, 0, 2), array('04', '05', '06'))) {
            return '+242' . $clean;
        }

        return '+242' . $clean;
    }

    // ─────────────────────────────
    // Providers SMS
    // ─────────────────────────────

    /**
     * Envoi via Airtel Africa SMS API
     */
    private function _send_airtel($phone, $message)
    {
        $api_url   = $this->CI->config->item('airtel_api_url');
        $client_id = $this->CI->config->item('airtel_client_id');
        $secret    = $this->CI->config->item('airtel_secret');

        if (empty($client_id) || empty($secret)) {
            log_message('info', "OTP [DEV] Airtel SMS to {$phone}: {$message}");
            return true; // Mode dev
        }

        // 1. Obtenir un access token
        $auth = $this->_curl_post($api_url . '/auth/oauth2/token', array(
            'client_id'     => $client_id,
            'client_secret' => $secret,
            'grant_type'    => 'client_credentials',
        ));

        if (!$auth || !isset($auth['access_token'])) {
            log_message('error', 'OTP: Airtel auth failed');
            return false;
        }

        // 2. Envoyer le SMS
        $result = $this->_curl_post($api_url . '/standard/v1/smsmessaging/outbound', array(
            'outboundSMSMessageRequest' => array(
                'address'                => 'tel:' . $phone,
                'senderAddress'          => 'LamukaMkt',
                'outboundSMSTextMessage' => array('message' => $message),
            ),
        ), array(
            'Authorization: Bearer ' . $auth['access_token'],
            'X-Country: CG',
            'X-Currency: XAF',
        ));

        return $result !== false;
    }

    /**
     * Envoi via MTN MoMo SMS (ou fallback provider)
     */
    private function _send_mtn($phone, $message)
    {
        // MTN Congo n'a pas d'API SMS publique directe.
        // Utiliser un provider SMS tiers (Africa's Talking, Twilio, InfoBip)
        log_message('info', "OTP [DEV] MTN SMS to {$phone}: {$message}");
        return true; // Mode dev - à remplacer par le vrai provider
    }

    /**
     * Fallback - log seulement (dev mode)
     */
    private function _send_fallback($phone, $message)
    {
        log_message('info', "OTP [FALLBACK] SMS to {$phone}: {$message}");
        return true;
    }

    // ─────────────────────────────
    // HTTP Client
    // ─────────────────────────────

    private function _curl_post($url, $data, $headers = array())
    {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($data),
            CURLOPT_HTTPHEADER     => array_merge(array(
                'Content-Type: application/json',
                'Accept: application/json',
            ), $headers),
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_SSL_VERIFYPEER => true,
        ));

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code >= 200 && $http_code < 300) {
            return json_decode($response, true);
        }

        log_message('error', "OTP CURL Error [{$http_code}]: {$response}");
        return false;
    }
}
