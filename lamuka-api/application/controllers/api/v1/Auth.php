<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Auth Controller — Authentification
 * POST /api/v1/auth/send-otp
 * POST /api/v1/auth/verify-otp
 * POST /api/v1/auth/social
 * POST /api/v1/auth/complete-profile
 * POST /api/v1/auth/logout
 */
class Auth extends API_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model(array('User_model', 'Otp_model', 'Session_model'));
        $this->load->library(array('JWT_lib', 'OTP_lib'));
    }

    /**
     * POST /auth/send-otp
     * Envoyer un code OTP par SMS
     */
    public function send_otp()
    {
        if (!$this->_method('POST')) return;

        $data = $this->_validate_required(array('phone'));
        if (!$data) return;

        $phone = $this->otp_lib->normalize_phone($data['phone']);
        $code = generate_otp(6);

        // Sauvegarder l'OTP
        $this->Otp_model->create($phone, $code);

        // Envoyer le SMS
        $sent = $this->otp_lib->send($phone, $code);

        if (!$sent) {
            return json_error('Impossible d\'envoyer le SMS. Réessayez.', 500);
        }

        json_success(array(
            'phone'   => $phone,
            'expires' => 10, // minutes
        ), 'Code OTP envoyé par SMS');
    }

    /**
     * POST /auth/verify-otp
     * Vérifier le code OTP et connecter
     */
    public function verify_otp()
    {
        if (!$this->_method('POST')) return;

        $data = $this->_validate_required(array('phone', 'code'));
        if (!$data) return;

        $phone = $this->otp_lib->normalize_phone($data['phone']);

        if (!$this->Otp_model->verify($phone, $data['code'])) {
            return json_error('Code OTP invalide ou expiré', 401);
        }

        // Trouver ou créer l'utilisateur
        $user = $this->User_model->get_by_phone($phone);
        $is_new = false;

        if (!$user) {
            $user_id = $this->User_model->create(array(
                'phone'             => $phone,
                'first_name'        => '',
                'last_name'         => '',
                'phone_verified_at' => date('Y-m-d H:i:s'),
                'status'            => 'active',
            ));
            $user = $this->User_model->get($user_id);
            $is_new = true;
        }

        // Générer le token JWT
        $token = $this->jwt_lib->encode($user->id, array('role' => $user->role));
        $this->Session_model->create($user->id, $token, $this->input->user_agent());
        $this->User_model->update_last_login($user->id);

        json_success(array(
            'token'  => $token,
            'user'   => $this->User_model->profile($user->id),
            'is_new' => $is_new,
        ), $is_new ? 'Compte créé avec succès' : 'Connexion réussie');
    }

    /**
     * POST /auth/social
     * Login via Google, Apple, Facebook
     */
    public function social()
    {
        if (!$this->_method('POST')) return;

        $data = $this->_validate_required(array('provider', 'provider_id'));
        if (!$data) return;

        $provider    = $data['provider'];
        $provider_id = $data['provider_id'];
        $email       = isset($data['email']) ? $data['email'] : null;
        $name        = isset($data['name']) ? $data['name'] : '';

        // Chercher un compte social existant
        $social = $this->db->get_where('social_accounts', array(
            'provider'    => $provider,
            'provider_id' => $provider_id,
        ))->row();

        if ($social) {
            // Compte existant — connecter
            $user = $this->User_model->get($social->user_id);
        } else {
            // Nouveau — créer ou lier
            $user = $email ? $this->User_model->get_by_email($email) : null;

            if (!$user) {
                $name_parts = explode(' ', $name, 2);
                $user_id = $this->User_model->create(array(
                    'email'             => $email,
                    'first_name'        => $name_parts[0] ?? '',
                    'last_name'         => $name_parts[1] ?? '',
                    'avatar'            => isset($data['avatar']) ? $data['avatar'] : null,
                    'email_verified_at' => date('Y-m-d H:i:s'),
                    'status'            => 'active',
                ));
                $user = $this->User_model->get($user_id);
            }

            // Lier le compte social
            $this->db->insert('social_accounts', array(
                'user_id'         => $user->id,
                'provider'        => $provider,
                'provider_id'     => $provider_id,
                'provider_email'  => $email,
                'provider_name'   => $name,
                'provider_avatar' => isset($data['avatar']) ? $data['avatar'] : null,
            ));
        }

        $is_new = empty($user->first_name);
        $token = $this->jwt_lib->encode($user->id, array('role' => $user->role));
        $this->Session_model->create($user->id, $token, $this->input->user_agent());
        $this->User_model->update_last_login($user->id);

        json_success(array(
            'token'  => $token,
            'user'   => $this->User_model->profile($user->id),
            'is_new' => $is_new,
        ), 'Connexion réussie');
    }

    /**
     * POST /auth/complete-profile
     * Compléter le profil après inscription
     */
    public function complete_profile()
    {
        // Auth requise pour cette route
        $this->auth_required = true;
        $this->_authenticate();

        if (!$this->_method('POST')) return;

        $data = $this->_validate_required(array('first_name', 'last_name'));
        if (!$data) return;

        $update = array(
            'first_name' => trim($data['first_name']),
            'last_name'  => trim($data['last_name']),
        );

        if (!empty($data['email']))      $update['email'] = $data['email'];
        if (!empty($data['gender']))     $update['gender'] = $data['gender'];
        if (!empty($data['birth_date'])) $update['birth_date'] = $data['birth_date'];

        $this->User_model->update($this->user_id, $update);

        json_success(
            $this->User_model->profile($this->user_id),
            'Profil complété avec succès'
        );
    }

    /**
     * POST /auth/logout
     */
    public function logout()
    {
        $token = $this->_get_bearer_token_public();
        if ($token) {
            $this->Session_model->deactivate($token);
        }
        json_success(null, 'Déconnecté avec succès');
    }

    /**
     * POST /auth/refresh
     */
    public function refresh()
    {
        $token = $this->_get_bearer_token_public();
        if (!$token) return json_error('Token requis', 401);

        $payload = $this->jwt_lib->decode($token);
        if (!$payload) return json_error('Token invalide', 401);

        // Désactiver l'ancien
        $this->Session_model->deactivate($token);

        // Générer un nouveau
        $user = $this->User_model->get($payload->user_id);
        $new_token = $this->jwt_lib->encode($user->id, array('role' => $user->role));
        $this->Session_model->create($user->id, $new_token, $this->input->user_agent());

        json_success(array('token' => $new_token), 'Token renouvelé');
    }

    // Méthode helper publique pour logout/refresh
    private function _get_bearer_token_public()
    {
        $header = $this->input->get_request_header('Authorization', true);
        if (!$header && isset($_SERVER['HTTP_AUTHORIZATION'])) $header = $_SERVER['HTTP_AUTHORIZATION'];
        if ($header && preg_match('/Bearer\s(\S+)/', $header, $m)) return $m[1];
        return null;
    }
}
