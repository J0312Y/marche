<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Followers Controller — Follow/Unfollow Établissements
 * POST   /api/v1/followers/toggle/:establishment_id
 * GET    /api/v1/followers
 * GET    /api/v1/followers/check/:establishment_id
 */
class Followers extends Auth_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Follower_model');
    }

    /**
     * GET /followers — Mes établissements suivis
     */
    public function index()
    {
        $p = get_pagination();
        $following = $this->Follower_model->get_following($this->user_id, $p['limit'], $p['offset']);
        json_success($following);
    }

    /**
     * POST /followers/toggle/:id — Follow/Unfollow
     */
    public function toggle($establishment_id)
    {
        if (!$this->_method('POST')) return;

        // Vérifier que l'établissement existe
        $estab = $this->db->get_where('establishments', array('id' => $establishment_id, 'status' => 'active'))->row();
        if (!$estab) {
            return json_error('Établissement introuvable', 404);
        }

        $is_following = $this->Follower_model->toggle($this->user_id, $establishment_id);
        $new_count = $this->Follower_model->count($establishment_id);

        // Notification au vendeur si follow
        if ($is_following) {
            $this->load->library('Push_lib');
            $this->push_lib->notify(
                $estab->owner_id,
                'system',
                '👤 Nouveau follower !',
                $this->user->first_name . ' suit maintenant ' . $estab->name,
                array('establishment_id' => $establishment_id),
                '👤'
            );
        }

        json_success(array(
            'is_following'    => $is_following,
            'followers_count' => $new_count,
        ), $is_following ? 'Vous suivez ' . $estab->name : 'Vous ne suivez plus ' . $estab->name);
    }

    /**
     * GET /followers/check/:id — Vérifier si je suis
     */
    public function check($establishment_id)
    {
        json_success(array(
            'is_following' => $this->Follower_model->is_following($this->user_id, $establishment_id),
        ));
    }
}
