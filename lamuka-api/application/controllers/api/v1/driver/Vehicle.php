<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vehicle extends Driver_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Driver_model'); }
    public function index() { $this->_route_method('_get', null, '_update'); }
    private function _get() { if (!$this->_require_driver()) return; json_success($this->driver); }
    private function _update() {
        if (!$this->_require_driver()) return;
        $data = get_json_input();
        $allowed = array('vehicle_type','vehicle_plate','vehicle_brand','license_number');
        $update = array_intersect_key($data, array_flip($allowed));
        $this->Driver_model->update($this->driver->id, $update);
        json_success(null, 'Véhicule mis à jour');
    }
}
