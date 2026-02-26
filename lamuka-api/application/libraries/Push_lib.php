<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Push_lib — Firebase Cloud Messaging
 * Lamuka Market
 */
class Push_lib
{
    private $CI;
    private $server_key;
    private $api_url;

    public function __construct()
    {
        $this->CI =& get_instance();
        $this->server_key = $this->CI->config->item('firebase_server_key');
        $this->api_url    = $this->CI->config->item('firebase_api_url');
    }

    /**
     * Envoyer une notification push à un utilisateur
     */
    public function send_to_user($user_id, $title, $body, $data = array())
    {
        $this->CI->db->select('fcm_token')->from('users')
            ->where('id', $user_id)
            ->where('fcm_token IS NOT NULL');
        $user = $this->CI->db->get()->row();

        if (!$user || empty($user->fcm_token)) {
            return false;
        }

        return $this->_send($user->fcm_token, $title, $body, $data);
    }

    /**
     * Envoyer à plusieurs utilisateurs
     */
    public function send_to_users($user_ids, $title, $body, $data = array())
    {
        $this->CI->db->select('fcm_token')->from('users')
            ->where_in('id', $user_ids)
            ->where('fcm_token IS NOT NULL');
        $users = $this->CI->db->get()->result();

        $tokens = array_map(function($u) { return $u->fcm_token; }, $users);
        $tokens = array_filter($tokens);

        if (empty($tokens)) return false;

        $success = 0;
        foreach ($tokens as $token) {
            if ($this->_send($token, $title, $body, $data)) {
                $success++;
            }
        }
        return $success;
    }

    /**
     * Sauvegarder en base + envoyer push
     */
    public function notify($user_id, $type, $title, $body, $data = array(), $icon = null)
    {
        // Sauvegarder la notification en base
        $this->CI->db->insert('notifications', array(
            'user_id'    => $user_id,
            'type'       => $type,
            'title'      => $title,
            'body'       => $body,
            'icon'       => $icon,
            'data'       => !empty($data) ? json_encode($data) : null,
            'created_at' => date('Y-m-d H:i:s'),
        ));

        // Envoyer le push
        return $this->send_to_user($user_id, $title, $body, $data);
    }

    // ─────────────────────────────

    private function _send($token, $title, $body, $data = array())
    {
        if (empty($this->server_key)) {
            log_message('info', "PUSH [DEV] → {$title}: {$body}");
            return true;
        }

        $payload = array(
            'to'           => $token,
            'notification' => array('title' => $title, 'body' => $body, 'sound' => 'default'),
            'data'         => $data,
            'priority'     => 'high',
        );

        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL            => $this->api_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => array(
                'Content-Type: application/json',
                'Authorization: key=' . $this->server_key,
            ),
        ));

        $result = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($result, true);
        return isset($response['success']) && $response['success'] > 0;
    }
}
