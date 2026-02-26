<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Wallet extends Driver_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Wallet_model'); }
    public function index() { json_success(array('wallet' => $this->Wallet_model->get_or_create($this->user_id), 'transactions' => $this->Wallet_model->transactions($this->user_id, null, 20))); }
    public function withdraw() {
        if (!$this->_method('POST')) return;
        $data = $this->_validate_required(array('amount', 'method', 'phone_number'));
        if (!$data) return;
        $result = $this->Wallet_model->debit($this->user_id, $data['amount'], 'Retrait livreur');
        if ($result === false) return json_error('Solde insuffisant', 422);
        $this->load->library('Payment_lib');
        $this->payment_lib->transfer($data['method'], $data['amount'], $data['phone_number'], 'DWDR-' . $this->user_id);
        json_success(array('balance' => $result), 'Retrait initié');
    }
}
