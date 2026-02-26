<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Payments extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model(array('Payment_model', 'Order_model')); $this->load->library('Payment_lib'); }

    public function initiate() {
        if (!$this->_method('POST')) return;
        $data = $this->_validate_required(array('order_id', 'method', 'phone_number'));
        if (!$data) return;

        $order = $this->Order_model->get($data['order_id']);
        if (!$order || $order->user_id != $this->user_id) return json_error('Commande introuvable', 404);
        if ($order->payment_status === 'paid') return json_error('Commande déjà payée', 422);

        $payment_id = $this->Payment_model->create(array(
            'order_id' => $order->id, 'user_id' => $this->user_id,
            'amount' => $order->total, 'method' => $data['method'],
            'phone_number' => $data['phone_number'], 'type' => 'order_payment',
        ));

        $result = $this->payment_lib->initiate($data['method'], $order->total, $data['phone_number'], 'ORD-' . $order->id);

        if ($result['success']) {
            $this->Payment_model->update_status($payment_id, 'processing');
            if (isset($result['provider_ref'])) {
                $this->db->where('id', $payment_id)->update('payments', array('provider_ref' => $result['provider_ref']));
            }
            json_success(array('payment_id' => $payment_id, 'provider_ref' => $result['provider_ref'] ?? null), $result['message']);
        } else {
            $this->Payment_model->update_status($payment_id, 'failed');
            json_error($result['message'], 422);
        }
    }

    public function callback() {
        $data = get_json_input();
        log_message('info', 'Payment callback: ' . json_encode($data));
        // TODO: Process callback from Airtel/MTN based on provider_ref
        json_success(null, 'OK');
    }

    public function status($id) {
        $payment = $this->Payment_model->get($id);
        if (!$payment || $payment->user_id != $this->user_id) return json_error('Paiement introuvable', 404);
        json_success(array('payment' => $payment));
    }
}
