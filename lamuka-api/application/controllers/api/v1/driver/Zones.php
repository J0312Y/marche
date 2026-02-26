<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Zones extends Driver_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Driver_model'); }
    public function index() { $this->_route_method('_list', '_add'); }
    private function _list() { if (!$this->_require_driver()) return; json_success($this->Driver_model->get_zones($this->driver->id)); }
    private function _add() {
        if (!$this->_require_driver()) return;
        $data = $this->_validate_required(array('zone_name'));
        if (!$data) return;
        $id = $this->Driver_model->add_zone($this->driver->id, $data['zone_name']);
        json_success(array('id' => $id), 'Zone ajoutée', 201);
    }
    public function item($id) { if (!$this->_method('DELETE')) return; $this->Driver_model->remove_zone($id, $this->driver->id); json_success(null, 'Zone retirée'); }
}
