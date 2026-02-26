<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Deliveries extends Driver_Controller
{
    public function __construct() { parent::__construct(); $this->load->model(array('Delivery_model', 'Order_model')); }

    public function index() {
        if (!$this->_require_driver()) return;
        json_success($this->Delivery_model->get_available($this->driver->id));
    }

    public function accept($id) {
        if (!$this->_method('POST')) return;
        if (!$this->_require_driver()) return;
        $delivery = $this->Delivery_model->get($id);
        if (!$delivery || $delivery->status !== 'pending') return json_error('Livraison non disponible', 422);
        $this->Delivery_model->assign_driver($id, $this->driver->id);
        $this->Order_model->update_status($delivery->order_id, 'picked_up');
        $this->Order_model->add_tracking($delivery->order_id, 'assigned', 'Livreur assigné');
        json_success(null, 'Livraison acceptée');
    }

    public function pickup($id) {
        if (!$this->_method('PUT')) return;
        if (!$this->_require_driver()) return;
        $data = $this->_validate_required(array('pickup_code'));
        if (!$data) return;
        $delivery = $this->Delivery_model->get($id);
        if (!$delivery || $delivery->driver_id != $this->driver->id) return json_error('Livraison introuvable', 404);
        if ($delivery->pickup_code !== $data['pickup_code']) return json_error('Code de retrait invalide', 422);
        $this->Delivery_model->update_status($id, 'picked_up');
        $this->Order_model->update_status($delivery->order_id, 'delivering');
        $this->Order_model->add_tracking($delivery->order_id, 'picked_up', 'Colis récupéré par le livreur');
        $this->load->library('Push_lib');
        $order = $this->Order_model->get($delivery->order_id);
        $this->push_lib->notify($order->user_id, 'delivery', '🚗 En route !', 'Votre commande est en cours de livraison', array('order_id' => $delivery->order_id), '🚗');
        json_success(null, 'Retrait confirmé');
    }

    public function deliver($id) {
        if (!$this->_method('PUT')) return;
        if (!$this->_require_driver()) return;
        $data = $this->_validate_required(array('delivery_code'));
        if (!$data) return;
        $delivery = $this->Delivery_model->get($id);
        if (!$delivery || $delivery->driver_id != $this->driver->id) return json_error('Livraison introuvable', 404);
        if ($delivery->delivery_code !== $data['delivery_code']) return json_error('Code de livraison invalide', 422);

        $this->Delivery_model->update_status($id, 'delivered');
        $this->Order_model->update_status($delivery->order_id, 'delivered');
        $this->Order_model->add_tracking($delivery->order_id, 'delivered', 'Commande livrée avec succès');

        // Créditer le livreur
        $earning = $delivery->driver_earning ?: $delivery->fee;
        if ($earning > 0) {
            $this->load->model('Wallet_model');
            $this->Wallet_model->credit($this->user_id, $earning, 'Livraison #' . $delivery->order_id);
        }

        // Incrémenter stats
        $this->load->model('Driver_model');
        $this->db->where('id', $this->driver->id)->set('total_deliveries', 'total_deliveries+1', false)->set('total_earned', 'total_earned+' . $earning, false)->update('driver_profiles');

        $this->load->library('Push_lib');
        $order = $this->Order_model->get($delivery->order_id);
        $this->push_lib->notify($order->user_id, 'delivery', '✅ Commande livrée', 'Votre commande a été livrée', array('order_id' => $delivery->order_id), '✅');

        json_success(array('earning' => $earning), 'Livraison confirmée');
    }

    public function history() {
        if (!$this->_require_driver()) return;
        $p = get_pagination();
        json_success($this->Delivery_model->get_history($this->driver->id, $p['limit'], $p['offset']));
    }
}
