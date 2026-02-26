<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Orders extends Vendor_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Order_model'); }

    public function index() {
        if (!$this->_require_establishment()) return;
        $status = $this->input->get('status'); $p = get_pagination();
        json_success($this->Order_model->get_by_establishment($this->establishment->id, $status, $p['limit'], $p['offset']));
    }

    public function detail($id) {
        $order = $this->Order_model->get($id);
        if (!$order || $order->establishment_id != $this->establishment->id) return json_error('Commande introuvable', 404);
        $items = $this->Order_model->get_items($id);
        json_success(array('order' => $order, 'items' => $items));
    }

    public function update_status($id) {
        if (!$this->_method('PUT')) return;
        $data = $this->_validate_required(array('status'));
        if (!$data) return;
        $allowed = array('confirmed','preparing','ready','cancelled');
        if (!in_array($data['status'], $allowed)) return json_error('Statut invalide', 422);

        $order = $this->Order_model->get($id);
        if (!$order || $order->establishment_id != $this->establishment->id) return json_error('Commande introuvable', 404);

        $this->Order_model->update_status($id, $data['status']);
        $this->Order_model->add_tracking($id, $data['status'], isset($data['message']) ? $data['message'] : null);

        // Notification au client
        $this->load->library('Push_lib');
        $titles = array('confirmed' => '✅ Commande confirmée', 'preparing' => '👨‍🍳 En préparation', 'ready' => '📦 Commande prête', 'cancelled' => '❌ Commande annulée');
        $this->push_lib->notify($order->user_id, 'order', $titles[$data['status']] ?? 'Commande', "Votre commande #{$order->ref}", array('order_id' => $id), '📦');

        json_success(null, 'Statut mis à jour');
    }
}
