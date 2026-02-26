<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Delivery_model extends CI_Model
{
    protected $table = 'deliveries';

    public function get($id) { return $this->db->get_where($this->table, array('id' => $id))->row(); }

    public function get_by_order($order_id) { return $this->db->get_where($this->table, array('order_id' => $order_id))->row(); }

    public function get_available($driver_id, $limit = 20) {
        return $this->db->select('d.*, o.ref, o.total, e.name as establishment_name, e.address as pickup_address_text')
            ->from($this->table . ' d')
            ->join('orders o', 'o.id = d.order_id')
            ->join('establishments e', 'e.id = o.establishment_id')
            ->where('d.status', 'pending')
            ->where('d.driver_id IS NULL')
            ->order_by('d.created_at', 'ASC')
            ->limit($limit)->get()->result();
    }

    public function get_active_by_driver($driver_id) {
        return $this->db->select('d.*, o.ref, o.total, o.user_id as client_id, e.name as establishment_name')
            ->from($this->table . ' d')
            ->join('orders o', 'o.id = d.order_id')
            ->join('establishments e', 'e.id = o.establishment_id')
            ->where('d.driver_id', $driver_id)
            ->where_in('d.status', array('assigned','pickup_arrived','picked_up','delivering'))
            ->get()->result();
    }

    public function get_history($driver_id, $limit = 20, $offset = 0) {
        return $this->db->select('d.*, o.ref, o.total')
            ->from($this->table . ' d')
            ->join('orders o', 'o.id = d.order_id')
            ->where('d.driver_id', $driver_id)
            ->where('d.status', 'delivered')
            ->order_by('d.delivered_at', 'DESC')
            ->limit($limit, $offset)->get()->result();
    }

    public function create($data) { $data['created_at'] = date('Y-m-d H:i:s'); $this->db->insert($this->table, $data); return $this->db->insert_id(); }

    public function update_status($id, $status) {
        $data = array('status' => $status, 'updated_at' => date('Y-m-d H:i:s'));
        if ($status === 'assigned')  $data['assigned_at']  = date('Y-m-d H:i:s');
        if ($status === 'picked_up') $data['picked_up_at'] = date('Y-m-d H:i:s');
        if ($status === 'delivered') $data['delivered_at']  = date('Y-m-d H:i:s');
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    public function assign_driver($id, $driver_id) {
        return $this->db->where('id', $id)->update($this->table, array('driver_id' => $driver_id, 'assigned_at' => date('Y-m-d H:i:s'), 'status' => 'assigned'));
    }
}
