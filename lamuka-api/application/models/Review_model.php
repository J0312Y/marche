<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Review_model extends CI_Model
{
    protected $table = 'reviews';

    public function get_by_article($article_id, $limit = 20, $offset = 0, $sort = 'newest') {
        $this->db->select('r.*, u.first_name, u.last_name, u.avatar')
            ->from($this->table . ' r')
            ->join('users u', 'u.id = r.user_id')
            ->where('r.article_id', $article_id)
            ->where('r.status', 'published');

        switch ($sort) {
            case 'highest': $this->db->order_by('r.rating', 'DESC'); break;
            case 'lowest':  $this->db->order_by('r.rating', 'ASC'); break;
            default:        $this->db->order_by('r.created_at', 'DESC');
        }
        return $this->db->limit($limit, $offset)->get()->result();
    }

    public function get_by_establishment($establishment_id, $limit = 20, $offset = 0) {
        return $this->db->select('r.*, u.first_name, u.last_name, u.avatar, a.name as article_name')
            ->from($this->table . ' r')
            ->join('users u', 'u.id = r.user_id')
            ->join('articles a', 'a.id = r.article_id', 'left')
            ->where('r.establishment_id', $establishment_id)
            ->where('r.status', 'published')
            ->order_by('r.created_at', 'DESC')
            ->limit($limit, $offset)->get()->result();
    }

    public function create($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function stats($article_id) {
        $total = $this->db->where('article_id', $article_id)->where('status', 'published')->count_all_results($this->table);
        $dist = array();
        for ($i = 5; $i >= 1; $i--) {
            $dist[$i] = $this->db->where('article_id', $article_id)->where('status', 'published')->where('rating', $i)->count_all_results($this->table);
        }
        return array('total' => $total, 'distribution' => $dist);
    }
}
