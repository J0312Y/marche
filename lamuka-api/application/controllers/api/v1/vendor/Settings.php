<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Settings extends Vendor_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Establishment_model'); }
    public function index() {
        $this->_route_method('_get', null, '_update');
    }
    private function _get() {
        if (!$this->_require_establishment()) return;
        $hours = $this->db->where('establishment_id', $this->establishment->id)->get('establishment_hours')->result();
        json_success(array('establishment' => $this->establishment, 'hours' => $hours));
    }
    private function _update() {
        if (!$this->_require_establishment()) return;
        $data = get_json_input();
        $allowed = array('name','description','phone','email','address','city','latitude','longitude','min_order','delivery_fee','is_open');
        $update = array_intersect_key($data, array_flip($allowed));
        $this->Establishment_model->update($this->establishment->id, $update);
        if (isset($data['hours']) && is_array($data['hours'])) {
            $this->db->where('establishment_id', $this->establishment->id)->delete('establishment_hours');
            foreach ($data['hours'] as $h) {
                $h['establishment_id'] = $this->establishment->id;
                $this->db->insert('establishment_hours', $h);
            }
        }
        json_success(null, 'Paramètres mis à jour');
    }
}
