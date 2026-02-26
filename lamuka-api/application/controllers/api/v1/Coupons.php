<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Coupons extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Coupon_model'); }
    public function index() { json_success($this->Coupon_model->get_active()); }
    public function verify() {
        if (!$this->_method('POST')) return;
        $data = $this->_validate_required(array('code', 'subtotal'));
        if (!$data) return;
        $result = $this->Coupon_model->verify($data['code'], $this->user_id, $data['subtotal']);
        if ($result['valid']) { json_success(array('discount' => $result['discount'], 'coupon' => $result['coupon']), 'Code valide'); }
        else { json_error($result['message'], 422); }
    }
}
