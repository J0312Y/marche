<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reviews extends Vendor_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Review_model'); }
    public function index() {
        if (!$this->_require_establishment()) return;
        $p = get_pagination();
        json_success($this->Review_model->get_by_establishment($this->establishment->id, $p['limit'], $p['offset']));
    }
}
