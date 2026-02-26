<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Establishment_model extends CI_Model
{
    protected $table = 'establishments';

    public function get($id)
    {
        return $this->db->select('e.*, u.first_name as owner_name, u.phone as owner_phone')
            ->from($this->table . ' e')
            ->join('users u', 'u.id = e.owner_id')
            ->where('e.id', $id)->get()->row();
    }

    public function get_all($filters = array())
    {
        $this->db->from($this->table)->where('status', 'active');

        if (!empty($filters['type']))  $this->db->where('type', $filters['type']);
        if (!empty($filters['city']))  $this->db->where('city', $filters['city']);
        if (!empty($filters['search'])) {
            $this->db->group_start()
                ->like('name', $filters['search'])
                ->or_like('description', $filters['search'])
                ->group_end();
        }

        $sort = isset($filters['sort']) ? $filters['sort'] : 'rating';
        switch ($sort) {
            case 'newest':  $this->db->order_by('created_at', 'DESC'); break;
            case 'name':    $this->db->order_by('name', 'ASC'); break;
            default:        $this->db->order_by('rating', 'DESC');
        }

        return $this->db;
    }

    public function count_all($filters = array())
    {
        $this->get_all($filters);
        return $this->db->count_all_results();
    }

    public function get_by_owner($owner_id, $id = null)
    {
        $this->db->where('owner_id', $owner_id);
        if ($id) $this->db->where('id', $id);
        return $this->db->get($this->table)->row();
    }

    public function get_first_by_owner($owner_id)
    {
        return $this->db->where('owner_id', $owner_id)
            ->where_in('status', array('active', 'pending'))
            ->order_by('id', 'ASC')
            ->get($this->table)->row();
    }

    public function get_shops_by_owner($owner_id)
    {
        return $this->db->where('owner_id', $owner_id)
            ->order_by('id', 'ASC')
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

    public function update_rating($id)
    {
        $stats = $this->db->select('AVG(rating) as avg_rating, COUNT(*) as total')
            ->from('reviews')->where('establishment_id', $id)
            ->where('status', 'published')->get()->row();

        return $this->update($id, array(
            'rating'        => round($stats->avg_rating, 1),
            'total_reviews' => $stats->total,
        ));
    }
}
