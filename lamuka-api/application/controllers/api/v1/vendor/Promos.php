<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Promos extends Vendor_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Coupon_model'); }

    public function index() { $this->_route_method('_list', '_create'); }

    private function _list() {
        if (!$this->_require_establishment()) return;
        $coupons = $this->db->where('establishment_id', $this->establishment->id)->order_by('created_at', 'DESC')->get('coupons')->result();
        json_success($coupons);
    }

    private function _create() {
        if (!$this->_require_establishment()) return;
        $data = $this->_validate_required(array('code', 'type', 'value', 'expires_at'));
        if (!$data) return;
        $data['establishment_id'] = $this->establishment->id;
        $data['code'] = strtoupper($data['code']);
        $id = $this->Coupon_model->create($data);
        json_success(array('id' => $id), 'Code promo créé', 201);
    }

    public function item($id) {
        if (!$this->_method('DELETE')) return;
        $this->Coupon_model->delete($id);
        json_success(null, 'Code promo supprimé');
    }
}
