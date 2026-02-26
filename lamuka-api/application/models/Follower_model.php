<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Follower_model extends CI_Model
{
    protected $table = 'followers';

    public function is_following($user_id, $establishment_id)
    {
        return $this->db->where('user_id', $user_id)
            ->where('establishment_id', $establishment_id)
            ->count_all_results($this->table) > 0;
    }

    public function toggle($user_id, $establishment_id)
    {
        if ($this->is_following($user_id, $establishment_id)) {
            $this->db->where('user_id', $user_id)
                ->where('establishment_id', $establishment_id)
                ->delete($this->table);
            // Décrémenter le compteur
            $this->db->where('id', $establishment_id)
                ->set('followers_count', 'GREATEST(followers_count - 1, 0)', false)
                ->update('establishments');
            return false; // unfollowed
        }

        $this->db->insert($this->table, array(
            'user_id'          => $user_id,
            'establishment_id' => $establishment_id,
        ));
        // Incrémenter le compteur
        $this->db->where('id', $establishment_id)
            ->set('followers_count', 'followers_count + 1', false)
            ->update('establishments');
        return true; // followed
    }

    public function get_following($user_id, $limit = 50, $offset = 0)
    {
        return $this->db->select('e.*, f.created_at as followed_at')
            ->from($this->table . ' f')
            ->join('establishments e', 'e.id = f.establishment_id')
            ->where('f.user_id', $user_id)
            ->where('e.status', 'active')
            ->order_by('f.created_at', 'DESC')
            ->limit($limit, $offset)
            ->get()->result();
    }

    public function get_followers($establishment_id, $limit = 50, $offset = 0)
    {
        return $this->db->select('u.id, u.first_name, u.last_name, u.avatar, f.created_at as followed_at')
            ->from($this->table . ' f')
            ->join('users u', 'u.id = f.user_id')
            ->where('f.establishment_id', $establishment_id)
            ->order_by('f.created_at', 'DESC')
            ->limit($limit, $offset)
            ->get()->result();
    }

    public function count($establishment_id)
    {
        return $this->db->where('establishment_id', $establishment_id)
            ->count_all_results($this->table);
    }
}
