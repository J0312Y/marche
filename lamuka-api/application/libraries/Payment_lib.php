<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Payment_lib — Mobile Money Integration
 * Lamuka Market · CodeIgniter 3
 *
 * Airtel Money, MTN MoMo, Kolo Pay
 * Flux : initiate → pending → callback → completed/failed
 */
class Payment_lib
{
    private $CI;

    public function __construct()
    {
        $this->CI =& get_instance();
    }

    /**
     * Initier un paiement Mobile Money
     *
     * @param string $method     airtel|mtn|kolo
     * @param int    $amount     Montant FCFA
     * @param string $phone      Numéro payeur
     * @param string $reference  Réf interne (order_id)
     * @return array ['success' => bool, 'provider_ref' => string, 'message' => string]
     */
    public function initiate($method, $amount, $phone, $reference)
    {
        switch ($method) {
            case 'airtel':
                return $this->_airtel_pay($amount, $phone, $reference);
            case 'mtn':
                return $this->_mtn_pay($amount, $phone, $reference);
            case 'kolo':
                return $this->_kolo_pay($amount, $phone, $reference);
            default:
                return array('success' => false, 'message' => 'Méthode de paiement non supportée');
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function check_status($method, $provider_ref)
    {
        switch ($method) {
            case 'airtel':
                return $this->_airtel_status($provider_ref);
            case 'mtn':
                return $this->_mtn_status($provider_ref);
            case 'kolo':
                return $this->_kolo_status($provider_ref);
            default:
                return array('status' => 'unknown');
        }
    }

    /**
     * Effectuer un transfert (withdrawal vers Mobile Money)
     */
    public function transfer($method, $amount, $phone, $reference)
    {
        switch ($method) {
            case 'airtel':
                return $this->_airtel_transfer($amount, $phone, $reference);
            case 'mtn':
                return $this->_mtn_transfer($amount, $phone, $reference);
            default:
                return array('success' => false, 'message' => 'Transfert non supporté pour cette méthode');
        }
    }

    // ═══════════════════════════════
    // AIRTEL MONEY
    // ═══════════════════════════════

    private function _airtel_pay($amount, $phone, $reference)
    {
        $api_url   = $this->CI->config->item('airtel_api_url');
        $client_id = $this->CI->config->item('airtel_client_id');
        $secret    = $this->CI->config->item('airtel_secret');

        // Mode dev
        if (empty($client_id)) {
            log_message('info', "PAYMENT [DEV] Airtel: {$amount} FCFA from {$phone} ref:{$reference}");
            return array(
                'success'      => true,
                'provider_ref' => 'DEV-AIR-' . time(),
                'message'      => 'Paiement initié (mode dev)',
            );
        }

        // 1. Auth token
        $auth = $this->_http_post($api_url . '/auth/oauth2/token', array(
            'client_id'     => $client_id,
            'client_secret' => $secret,
            'grant_type'    => 'client_credentials',
        ));

        if (!$auth || !isset($auth['access_token'])) {
            return array('success' => false, 'message' => 'Erreur authentification Airtel');
        }

        // 2. Collection request
        $result = $this->_http_post($api_url . '/merchant/v1/payments/', array(
            'reference'   => $reference,
            'subscriber'  => array(
                'country'  => 'CG',
                'currency' => 'XAF',
                'msisdn'   => preg_replace('/^\+?242/', '', $phone),
            ),
            'transaction' => array(
                'amount'   => $amount,
                'country'  => 'CG',
                'currency' => 'XAF',
                'id'       => $reference,
            ),
        ), array(
            'Authorization: Bearer ' . $auth['access_token'],
            'X-Country: CG',
            'X-Currency: XAF',
        ));

        if ($result && isset($result['data']['transaction']['id'])) {
            return array(
                'success'      => true,
                'provider_ref' => $result['data']['transaction']['id'],
                'message'      => 'Validez le paiement sur votre téléphone',
            );
        }

        return array('success' => false, 'message' => 'Erreur paiement Airtel Money');
    }

    private function _airtel_status($provider_ref)
    {
        // TODO: Implement real status check
        return array('status' => 'pending');
    }

    private function _airtel_transfer($amount, $phone, $reference)
    {
        log_message('info', "TRANSFER [DEV] Airtel: {$amount} FCFA to {$phone}");
        return array('success' => true, 'provider_ref' => 'DEV-XFER-' . time(), 'message' => 'Transfert initié');
    }

    // ═══════════════════════════════
    // MTN MOMO
    // ═══════════════════════════════

    private function _mtn_pay($amount, $phone, $reference)
    {
        $api_url = $this->CI->config->item('mtn_api_url');
        $sub_key = $this->CI->config->item('mtn_subscription_key');

        // Mode dev
        if (empty($sub_key)) {
            log_message('info', "PAYMENT [DEV] MTN: {$amount} FCFA from {$phone} ref:{$reference}");
            return array(
                'success'      => true,
                'provider_ref' => 'DEV-MTN-' . time(),
                'message'      => 'Paiement initié (mode dev)',
            );
        }

        // TODO: Implement real MTN MoMo API call
        return array('success' => false, 'message' => 'MTN MoMo en cours d\'intégration');
    }

    private function _mtn_status($provider_ref)
    {
        return array('status' => 'pending');
    }

    private function _mtn_transfer($amount, $phone, $reference)
    {
        log_message('info', "TRANSFER [DEV] MTN: {$amount} FCFA to {$phone}");
        return array('success' => true, 'provider_ref' => 'DEV-XFER-' . time(), 'message' => 'Transfert initié');
    }

    // ═══════════════════════════════
    // KOLO PAY
    // ═══════════════════════════════

    private function _kolo_pay($amount, $phone, $reference)
    {
        $api_url = $this->CI->config->item('kolo_api_url');

        // Mode dev
        if (empty($api_url)) {
            log_message('info', "PAYMENT [DEV] Kolo: {$amount} FCFA from {$phone} ref:{$reference}");
            return array(
                'success'      => true,
                'provider_ref' => 'DEV-KOLO-' . time(),
                'message'      => 'Paiement Kolo Pay initié (mode dev)',
            );
        }

        // TODO: Intégrer l'API Kolo Pay interne
        return array('success' => false, 'message' => 'Kolo Pay en cours d\'intégration');
    }

    private function _kolo_status($provider_ref)
    {
        return array('status' => 'pending');
    }

    // ═══════════════════════════════
    // HTTP CLIENT
    // ═══════════════════════════════

    private function _http_post($url, $data, $headers = array())
    {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($data),
            CURLOPT_HTTPHEADER     => array_merge(array(
                'Content-Type: application/json',
            ), $headers),
            CURLOPT_TIMEOUT        => 30,
        ));

        $response = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($code >= 200 && $code < 300) {
            return json_decode($response, true);
        }

        log_message('error', "Payment HTTP Error [{$code}] {$url}: {$response}");
        return false;
    }
}
