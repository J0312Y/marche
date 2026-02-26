<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Article_model extends CI_Model
{
    protected $table = 'articles';

    public function get($id)
    {
        return $this->db->select('a.*, e.name as establishment_name, e.avatar as establishment_avatar, e.type as commerce_type, c.name as category_name')
            ->from($this->table . ' a')
            ->join('establishments e', 'e.id = a.establishment_id')
            ->join('categories c', 'c.id = a.category_id', 'left')
            ->where('a.id', $id)->get()->row();
    }

    public function get_images($article_id)
    {
        return $this->db->where('article_id', $article_id)
            ->order_by('sort_order', 'ASC')
            ->get('article_images')->result();
    }

    public function search($filters = array())
    {
        $this->db->select('a.*, e.name as establishment_name, e.avatar as establishment_avatar, e.type as commerce_type')
            ->from($this->table . ' a')
            ->join('establishments e', 'e.id = a.establishment_id AND e.status = "active"')
            ->where('a.is_active', 1);

        if (!empty($filters['search'])) {
            $this->db->group_start()
                ->like('a.name', $filters['search'])
                ->or_like('a.description', $filters['search'])
                ->group_end();
        }
        if (!empty($filters['category_id']))     $this->db->where('a.category_id', $filters['category_id']);
        if (!empty($filters['establishment_id'])) $this->db->where('a.establishment_id', $filters['establishment_id']);
        if (!empty($filters['type']))            $this->db->where('e.type', $filters['type']);
        if (!empty($filters['min_price']))       $this->db->where('a.price >=', $filters['min_price']);
        if (!empty($filters['max_price']))       $this->db->where('a.price <=', $filters['max_price']);

        $sort = isset($filters['sort']) ? $filters['sort'] : 'popular';
        switch ($sort) {
            case 'price_asc':  $this->db->order_by('a.price', 'ASC'); break;
            case 'price_desc': $this->db->order_by('a.price', 'DESC'); break;
            case 'rating':     $this->db->order_by('a.rating', 'DESC'); break;
            case 'newest':     $this->db->order_by('a.created_at', 'DESC'); break;
            default:           $this->db->order_by('a.total_sold', 'DESC');
        }

        return $this->db;
    }

    public function count_search($filters = array())
    {
        $this->search($filters);
        return $this->db->count_all_results();
    }

    public function popular($limit = 20)
    {
        return $this->db->select('a.*, e.name as establishment_name, e.avatar as establishment_avatar')
            ->from($this->table . ' a')
            ->join('establishments e', 'e.id = a.establishment_id AND e.status = "active"')
            ->where('a.is_active', 1)
            ->order_by('a.total_sold', 'DESC')
            ->limit($limit)->get()->result();
    }

    public function by_establishment($establishment_id, $limit = 50, $offset = 0)
    {
        return $this->db->where('establishment_id', $establishment_id)
            ->where('is_active', 1)
            ->order_by('sort_order', 'ASC')
            ->limit($limit, $offset)
            ->get($this->table)->result();
    }

    public function create($data)
    {
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function update($id, $data)
    {
        $data['updated_at'] = date('Y-m-d H:i:s');
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    public function delete($id)
    {
        return $this->db->where('id', $id)->delete($this->table);
    }

    public function update_rating($id)
    {
        $stats = $this->db->select('AVG(rating) as avg, COUNT(*) as total')
            ->from('reviews')->where('article_id', $id)
            ->where('status', 'published')->get()->row();

        return $this->update($id, array(
            'rating'        => round($stats->avg, 1),
            'total_reviews' => $stats->total,
        ));
    }
}
