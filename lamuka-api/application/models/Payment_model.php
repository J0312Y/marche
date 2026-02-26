<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Payment_model extends CI_Model
{
    protected $table = 'payments';

    public function create($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function get($id) { return $this->db->get_where($this->table, array('id' => $id))->row(); }

    public function get_by_provider_ref($ref) { return $this->db->get_where($this->table, array('provider_ref' => $ref))->row(); }

    public function update_status($id, $status) {
        $data = array('status' => $status, 'updated_at' => date('Y-m-d H:i:s'));
        if ($status === 'completed') $data['completed_at'] = date('Y-m-d H:i:s');
        return $this->db->where('id', $id)->update($this->table, $data);
    }
}
