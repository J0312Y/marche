<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Location extends Driver_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Driver_model'); }

    public function update() {
        if (!$this->_method('PUT')) return;
        if (!$this->_require_driver()) return;
        $data = $this->_validate_required(array('latitude', 'longitude'));
        if (!$data) return;
        $this->Driver_model->update_location($this->driver->id, $data['latitude'], $data['longitude']);
        json_success(null, 'Position mise à jour');
    }

    public function availability() {
        if (!$this->_method('PUT')) return;
        if (!$this->_require_driver()) return;
        $data = $this->_validate_required(array('is_available'));
        if (!$data) return;
        $this->Driver_model->set_availability($this->driver->id, (bool)$data['is_available']);
        json_success(null, $data['is_available'] ? 'Vous êtes en ligne' : 'Vous êtes hors ligne');
    }
}
