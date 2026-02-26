<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * MY_Controller — Base Controller API
 * Lamuka Market · CodeIgniter 3
 *
 * Toutes les routes API héritent de ce controller.
 * Gère : CORS, authentification JWT, méthodes HTTP, réponses JSON.
 */
class MY_Controller extends CI_Controller
{
    /** @var object|null Utilisateur authentifié */
    protected $user = null;

    /** @var int|null ID utilisateur */
    protected $user_id = null;

    /** @var bool Nécessite authentification */
    protected $auth_required = false;

    /** @var array Rôles autorisés (vide = tous) */
    protected $allowed_roles = array();

    public function __construct()
    {
        parent::__construct();

        // CORS
        $this->_set_cors();

        // Handle OPTIONS preflight
        if (request_method() === 'OPTIONS') {
            json_response(array('status' => 'ok'), 200);
            exit;
        }

        // Auth si requis
        if ($this->auth_required) {
            $this->_authenticate();
        }
    }

    // ─────────────────────────────────
    // CORS
    // ─────────────────────────────────

    private function _set_cors()
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        header('Access-Control-Max-Age: 3600');
        header('Content-Type: application/json; charset=UTF-8');
    }

    // ─────────────────────────────────
    // AUTHENTICATION
    // ─────────────────────────────────

    /**
     * Authentifier via JWT Bearer Token
     */
    protected function _authenticate()
    {
        $token = $this->_get_bearer_token();

        if (!$token) {
            json_error('Token d\'authentification requis', 401);
            exit;
        }

        $this->load->library('JWT_lib');
        $payload = $this->jwt_lib->decode($token);

        if (!$payload) {
            json_error('Token invalide ou expiré', 401);
            exit;
        }

        // Vérifier session active
        $this->load->model('Session_model');
        $session = $this->Session_model->get_active_by_token($token);

        if (!$session) {
            json_error('Session expirée, veuillez vous reconnecter', 401);
            exit;
        }

        // Charger l'utilisateur
        $this->load->model('User_model');
        $this->user = $this->User_model->get($payload->user_id);

        if (!$this->user || $this->user->status !== 'active') {
            json_error('Compte désactivé ou introuvable', 403);
            exit;
        }

        $this->user_id = (int) $this->user->id;

        // Vérifier le rôle
        if (!empty($this->allowed_roles)) {
            $has_role = false;
            foreach ($this->allowed_roles as $role) {
                if ($this->user->role === $role || $this->user->role === 'both' || $this->user->role === 'admin') {
                    $has_role = true;
                    break;
                }
            }
            if (!$has_role) {
                json_error('Accès non autorisé pour votre rôle', 403);
                exit;
            }
        }

        // MAJ dernière activité
        $this->Session_model->update_activity($session->id);
    }

    /**
     * Authentification optionnelle (pour les routes publiques avec bonus si connecté)
     */
    protected function _authenticate_optional()
    {
        $token = $this->_get_bearer_token();

        if ($token) {
            $this->load->library('JWT_lib');
            $payload = $this->jwt_lib->decode($token);

            if ($payload) {
                $this->load->model('User_model');
                $this->user = $this->User_model->get($payload->user_id);
                $this->user_id = $this->user ? (int) $this->user->id : null;
            }
        }
    }

    /**
     * Extraire le Bearer Token du header Authorization
     */
    private function _get_bearer_token()
    {
        $header = $this->input->get_request_header('Authorization', true);

        if (!$header) {
            // Fallback pour certains serveurs
            if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
                $header = $_SERVER['HTTP_AUTHORIZATION'];
            } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
                $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
            }
        }

        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    // ─────────────────────────────────
    // HTTP METHOD HELPERS
    // ─────────────────────────────────

    /**
     * Vérifier la méthode HTTP, renvoie erreur 405 si mauvaise
     */
    protected function _method($method)
    {
        if (request_method() !== strtoupper($method)) {
            json_error('Méthode ' . request_method() . ' non autorisée', 405);
            return false;
        }
        return true;
    }

    /**
     * Router automatiquement GET/POST/PUT/DELETE vers des méthodes
     */
    protected function _route_method($get = null, $post = null, $put = null, $delete = null)
    {
        $method = request_method();
        switch ($method) {
            case 'GET':    return $get    ? $this->$get()    : json_error('GET non supporté', 405);
            case 'POST':   return $post   ? $this->$post()   : json_error('POST non supporté', 405);
            case 'PUT':    return $put    ? $this->$put()    : json_error('PUT non supporté', 405);
            case 'DELETE': return $delete ? $this->$delete() : json_error('DELETE non supporté', 405);
            default:       return json_error('Méthode non supportée', 405);
        }
    }

    // ─────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────

    /**
     * Valider les champs requis du body JSON
     * @param array $fields Liste de champs requis
     * @return array|false Retourne les données ou false avec erreur JSON
     */
    protected function _validate_required($fields)
    {
        $data = get_json_input();
        $missing = array();

        foreach ($fields as $field) {
            if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
                $missing[] = $field;
            }
        }

        if (!empty($missing)) {
            json_error('Champs requis manquants : ' . implode(', ', $missing), 422, $missing);
            return false;
        }

        return $data;
    }

    // ─────────────────────────────────
    // ACTIVITY LOGGING
    // ─────────────────────────────────

    /**
     * Logger une action
     */
    protected function _log_activity($action, $entity_type = null, $entity_id = null, $metadata = null)
    {
        $this->db->insert('activity_logs', array(
            'user_id'     => $this->user_id,
            'action'      => $action,
            'entity_type' => $entity_type,
            'entity_id'   => $entity_id,
            'metadata'    => $metadata ? json_encode($metadata) : null,
            'ip_address'  => get_client_ip(),
            'created_at'  => date('Y-m-d H:i:s'),
        ));
    }
}

// ─────────────────────────────────────────
// API_Controller — Controller public (pas d'auth)
// ─────────────────────────────────────────

class API_Controller extends MY_Controller
{
    protected $auth_required = false;
}

// ─────────────────────────────────────────
// Auth_Controller — Controller authentifié
// ─────────────────────────────────────────

class Auth_Controller extends MY_Controller
{
    protected $auth_required = true;
}

// ─────────────────────────────────────────
// Vendor_Controller — Controller vendeur
// ─────────────────────────────────────────

class Vendor_Controller extends MY_Controller
{
    protected $auth_required = true;
    protected $allowed_roles = array('vendor', 'both', 'admin');

    /** @var object Établissement actif */
    protected $establishment = null;

    public function __construct()
    {
        parent::__construct();
        $this->_load_establishment();
    }

    private function _load_establishment()
    {
        if (!$this->user_id) return;

        $this->load->model('Establishment_model');

        // Utiliser l'establishment_id du query param ou le premier actif
        $estab_id = $this->input->get('establishment_id');

        if ($estab_id) {
            $this->establishment = $this->Establishment_model->get_by_owner($this->user_id, $estab_id);
        } else {
            $this->establishment = $this->Establishment_model->get_first_by_owner($this->user_id);
        }
    }

    /**
     * Vérifier qu'un établissement est sélectionné
     */
    protected function _require_establishment()
    {
        if (!$this->establishment) {
            json_error('Aucun établissement trouvé. Créez-en un d\'abord.', 404);
            return false;
        }
        return true;
    }
}

// ─────────────────────────────────────────
// Driver_Controller — Controller livreur
// ─────────────────────────────────────────

class Driver_Controller extends MY_Controller
{
    protected $auth_required = true;
    protected $allowed_roles = array('driver', 'both', 'admin');

    /** @var object Profil livreur */
    protected $driver = null;

    public function __construct()
    {
        parent::__construct();
        $this->_load_driver_profile();
    }

    private function _load_driver_profile()
    {
        if (!$this->user_id) return;

        $this->load->model('Driver_model');
        $this->driver = $this->Driver_model->get_by_user($this->user_id);
    }

    protected function _require_driver()
    {
        if (!$this->driver) {
            json_error('Profil livreur introuvable', 404);
            return false;
        }
        return true;
    }
}
