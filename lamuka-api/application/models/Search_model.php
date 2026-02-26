<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Search_model extends CI_Model
{
    public function log_search($user_id, $query, $type = 'article', $results_count = 0)
    {
        $this->db->insert('search_history', array(
            'user_id'       => $user_id,
            'query'         => $query,
            'type'          => $type,
            'results_count' => $results_count,
        ));
    }

    public function get_history($user_id, $limit = 20)
    {
        return $this->db->select('query, type, MAX(created_at) as last_searched, COUNT(*) as search_count')
            ->from('search_history')
            ->where('user_id', $user_id)
            ->group_by('query, type')
            ->order_by('last_searched', 'DESC')
            ->limit($limit)
            ->get()->result();
    }

    public function clear_history($user_id)
    {
        return $this->db->where('user_id', $user_id)->delete('search_history');
    }

    public function add_recently_viewed($user_id, $article_id)
    {
        // Upsert
        $exists = $this->db->where('user_id', $user_id)
            ->where('article_id', $article_id)
            ->get('recently_viewed')->row();

        if ($exists) {
            return $this->db->where('id', $exists->id)
                ->update('recently_viewed', array('viewed_at' => date('Y-m-d H:i:s')));
        }

        return $this->db->insert('recently_viewed', array(
            'user_id'    => $user_id,
            'article_id' => $article_id,
        ));
    }

    public function get_recently_viewed($user_id, $limit = 20)
    {
        return $this->db->select('a.*, e.name as establishment_name, rv.viewed_at')
            ->from('recently_viewed rv')
            ->join('articles a', 'a.id = rv.article_id')
            ->join('establishments e', 'e.id = a.establishment_id')
            ->where('rv.user_id', $user_id)
            ->where('a.is_active', 1)
            ->order_by('rv.viewed_at', 'DESC')
            ->limit($limit)
            ->get()->result();
    }
}
