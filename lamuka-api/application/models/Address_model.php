<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Address_model extends CI_Model
{
    protected $table = 'addresses';

    public function get_by_user($user_id) {
        return $this->db->where('user_id', $user_id)->order_by('is_default', 'DESC')->get($this->table)->result();
    }

    public function get($id, $user_id = null) {
        if ($user_id) $this->db->where('user_id', $user_id);
        return $this->db->get_where($this->table, array('id' => $id))->row();
    }

    public function create($data) {
        if (!empty($data['is_default'])) $this->clear_defaults($data['user_id']);
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function update($id, $data) {
        if (!empty($data['is_default'])) $this->clear_defaults($data['user_id'] ?? null);
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    public function delete($id, $user_id) {
        return $this->db->where('id', $id)->where('user_id', $user_id)->delete($this->table);
    }

    public function set_default($id, $user_id) {
        $this->clear_defaults($user_id);
        return $this->db->where('id', $id)->where('user_id', $user_id)->update($this->table, array('is_default' => 1));
    }

    private function clear_defaults($user_id) {
        if ($user_id) $this->db->where('user_id', $user_id)->update($this->table, array('is_default' => 0));
    }
}
