<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Wallets extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Wallet_model'); }

    public function balance() { json_success($this->Wallet_model->get_or_create($this->user_id)); }

    public function topup() {
        if (!$this->_method('POST')) return;
        $data = $this->_validate_required(array('amount', 'method', 'phone_number'));
        if (!$data) return;
        if ($data['amount'] < 500) return json_error('Montant minimum : 500 FCFA', 422);
        $this->load->library('Payment_lib');
        $result = $this->payment_lib->initiate($data['method'], $data['amount'], $data['phone_number'], 'TOP-' . $this->user_id . '-' . time());
        if ($result['success']) {
            $this->Wallet_model->credit($this->user_id, $data['amount'], 'Recharge ' . strtoupper($data['method']));
            json_success(array('balance' => $this->Wallet_model->get_or_create($this->user_id)->balance), 'Recharge effectuée');
        } else { json_error($result['message'], 422); }
    }

    public function withdraw() {
        if (!$this->_method('POST')) return;
        $data = $this->_validate_required(array('amount', 'method', 'phone_number'));
        if (!$data) return;
        $min = 5000;
        if ($data['amount'] < $min) return json_error("Montant minimum de retrait : " . format_price($min), 422);
        $result = $this->Wallet_model->debit($this->user_id, $data['amount'], 'Retrait ' . strtoupper($data['method']));
        if ($result === false) return json_error('Solde insuffisant', 422);
        $this->load->library('Payment_lib');
        $this->payment_lib->transfer($data['method'], $data['amount'], $data['phone_number'], 'WDR-' . $this->user_id);
        json_success(array('balance' => $result), 'Retrait initié');
    }

    public function transactions() {
        $type = $this->input->get('type'); $p = get_pagination();
        json_success($this->Wallet_model->transactions($this->user_id, $type, $p['limit'], $p['offset']));
    }
}
