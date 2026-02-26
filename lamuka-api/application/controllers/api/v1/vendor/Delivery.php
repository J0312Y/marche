<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Delivery extends Vendor_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Delivery_model'); }

    public function index() {
        if (!$this->_require_establishment()) return;
        $deliveries = $this->db->select('d.*, o.ref, o.total, dp.vehicle_type, u.first_name as driver_name')
            ->from('deliveries d')
            ->join('orders o', 'o.id = d.order_id')
            ->join('driver_profiles dp', 'dp.id = d.driver_id', 'left')
            ->join('users u', 'u.id = dp.user_id', 'left')
            ->where('o.establishment_id', $this->establishment->id)
            ->where_in('d.status', array('pending','assigned','pickup_arrived','picked_up','delivering'))
            ->get()->result();
        json_success($deliveries);
    }

    public function assign($id) {
        if (!$this->_method('POST')) return;
        $data = $this->_validate_required(array('driver_id'));
        if (!$data) return;
        $this->Delivery_model->assign_driver($id, $data['driver_id']);
        $this->load->library('Push_lib');
        $driver = $this->db->select('user_id')->from('driver_profiles')->where('id', $data['driver_id'])->get()->row();
        if ($driver) $this->push_lib->notify($driver->user_id, 'delivery', '📦 Nouvelle livraison', 'Une livraison vous a été assignée', array('delivery_id' => $id), '🚗');
        json_success(null, 'Livreur assigné');
    }

    public function track($id) {
        $delivery = $this->Delivery_model->get($id);
        if (!$delivery) return json_error('Livraison introuvable', 404);
        $driver = null;
        if ($delivery->driver_id) {
            $driver = $this->db->select('dp.*, u.first_name, u.last_name, u.phone')
                ->from('driver_profiles dp')->join('users u', 'u.id = dp.user_id')
                ->where('dp.id', $delivery->driver_id)->get()->row();
        }
        json_success(array('delivery' => $delivery, 'driver' => $driver));
    }
}
