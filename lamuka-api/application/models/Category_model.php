<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Category_model extends CI_Model
{
    protected $table = 'categories';

    public function get_all($type = null)
    {
        $this->db->where('is_active', 1)->order_by('sort_order', 'ASC');
        if ($type) $this->db->where('commerce_type', $type);
        return $this->db->get($this->table)->result();
    }

    public function get($id)
    {
        return $this->db->get_where($this->table, array('id' => $id))->row();
    }

    public function get_with_count($type = null)
    {
        $this->db->select('c.*, COUNT(a.id) as article_count')
            ->from($this->table . ' c')
            ->join('articles a', 'a.category_id = c.id AND a.is_active = 1', 'left')
            ->where('c.is_active', 1)
            ->group_by('c.id')
            ->order_by('c.sort_order', 'ASC');
        if ($type) $this->db->where('c.commerce_type', $type);
        return $this->db->get()->result();
    }
}
