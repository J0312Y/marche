<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Order_model extends CI_Model
{
    protected $table = 'orders';

    public function get($id) {
        return $this->db->select('o.*, u.first_name, u.last_name, u.phone as user_phone, e.name as establishment_name, e.avatar as establishment_avatar')
            ->from($this->table . ' o')
            ->join('users u', 'u.id = o.user_id')
            ->join('establishments e', 'e.id = o.establishment_id')
            ->where('o.id', $id)->get()->row();
    }

    public function get_items($order_id) {
        return $this->db->select('oi.*, a.image')->from('order_items oi')
            ->join('articles a', 'a.id = oi.article_id', 'left')
            ->where('oi.order_id', $order_id)->get()->result();
    }

    public function get_by_user($user_id, $status = null, $limit = 20, $offset = 0) {
        $this->db->select('o.*, e.name as establishment_name, e.avatar as establishment_avatar')
            ->from($this->table . ' o')
            ->join('establishments e', 'e.id = o.establishment_id')
            ->where('o.user_id', $user_id);
        if ($status) $this->db->where('o.status', $status);
        return $this->db->order_by('o.created_at', 'DESC')->limit($limit, $offset)->get()->result();
    }

    public function get_by_establishment($establishment_id, $status = null, $limit = 20, $offset = 0) {
        $this->db->from($this->table)
            ->where('establishment_id', $establishment_id);
        if ($status) $this->db->where('status', $status);
        return $this->db->order_by('created_at', 'DESC')->limit($limit, $offset)->get()->result();
    }

    public function create($data) {
        $data['ref'] = generate_order_ref();
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function add_item($data) {
        $this->db->insert('order_items', $data);
        return $this->db->insert_id();
    }

    public function update_status($id, $status) {
        $data = array('status' => $status, 'updated_at' => date('Y-m-d H:i:s'));
        $timestamp_field = $status . '_at';
        if (in_array($status, array('confirmed','preparing','ready','picked_up','delivered','cancelled'))) {
            $data[$timestamp_field] = date('Y-m-d H:i:s');
        }
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    public function add_tracking($order_id, $status, $message = null, $lat = null, $lng = null) {
        $this->db->insert('order_tracking', array(
            'order_id'  => $order_id, 'status' => $status, 'message' => $message,
            'latitude'  => $lat, 'longitude' => $lng,
        ));
    }

    public function count_by_establishment($establishment_id, $status = null) {
        $this->db->where('establishment_id', $establishment_id);
        if ($status) $this->db->where('status', $status);
        return $this->db->count_all_results($this->table);
    }

    public function revenue_by_establishment($establishment_id, $period = 'month') {
        $this->db->select_sum('total')->from($this->table)
            ->where('establishment_id', $establishment_id)
            ->where('payment_status', 'paid');
        switch ($period) {
            case 'today': $this->db->where('DATE(created_at)', date('Y-m-d')); break;
            case 'week':  $this->db->where('created_at >=', date('Y-m-d', strtotime('-7 days'))); break;
            case 'month': $this->db->where('created_at >=', date('Y-m-01')); break;
            case 'year':  $this->db->where('created_at >=', date('Y-01-01')); break;
        }
        return (int) $this->db->get()->row()->total;
    }
}
