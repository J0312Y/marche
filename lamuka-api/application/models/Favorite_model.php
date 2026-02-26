<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Favorite_model extends CI_Model
{
    protected $table = 'favorites';

    public function get_by_user($user_id, $limit = 50, $offset = 0) {
        return $this->db->select('a.*, e.name as establishment_name, e.avatar as establishment_avatar, f.created_at as fav_date')
            ->from($this->table . ' f')
            ->join('articles a', 'a.id = f.article_id')
            ->join('establishments e', 'e.id = a.establishment_id')
            ->where('f.user_id', $user_id)
            ->where('a.is_active', 1)
            ->order_by('f.created_at', 'DESC')
            ->limit($limit, $offset)->get()->result();
    }

    public function is_fav($user_id, $article_id) {
        return $this->db->where('user_id', $user_id)->where('article_id', $article_id)->count_all_results($this->table) > 0;
    }

    public function toggle($user_id, $article_id) {
        if ($this->is_fav($user_id, $article_id)) {
            $this->db->where('user_id', $user_id)->where('article_id', $article_id)->delete($this->table);
            return false; // removed
        }
        $this->db->insert($this->table, array('user_id' => $user_id, 'article_id' => $article_id));
        return true; // added
    }
}
