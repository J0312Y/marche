<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Stats extends Driver_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Driver_model'); }
    public function index() {
        if (!$this->_require_driver()) return;
        $period = $this->input->get('period') ?: 'month';
        json_success(array(
            'stats'  => $this->Driver_model->stats($this->driver->id, $period),
            'period' => $period,
            'driver' => $this->driver,
        ));
    }
}
