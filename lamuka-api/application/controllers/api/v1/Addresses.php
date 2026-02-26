<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Addresses extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Address_model'); }
    public function index() { $this->_route_method('_list', '_add'); }
    private function _list() { json_success($this->Address_model->get_by_user($this->user_id)); }
    private function _add() {
        $data = $this->_validate_required(array('label', 'address'));
        if (!$data) return;
        $data['user_id'] = $this->user_id;
        $id = $this->Address_model->create($data);
        json_success(array('id' => $id), 'Adresse ajoutée', 201);
    }
    public function item($id) { $this->_route_method(null, null, '_update', '_delete'); }
    private function _update() {
        $id = $this->uri->segment(4); $data = get_json_input();
        $this->Address_model->update($id, $data);
        json_success(null, 'Adresse mise à jour');
    }
    private function _delete() { $id = $this->uri->segment(4); $this->Address_model->delete($id, $this->user_id); json_success(null, 'Adresse supprimée'); }
    public function set_default($id) {
        if (!$this->_method('PUT')) return;
        $this->Address_model->set_default($id, $this->user_id);
        json_success(null, 'Adresse par défaut mise à jour');
    }
}
