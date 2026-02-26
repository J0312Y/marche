<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Team extends Vendor_Controller
{
    public function index() {
        if (!$this->_require_establishment()) return;
        $members = $this->db->select('et.*, u.first_name, u.last_name, u.phone, u.avatar')
            ->from('establishment_team et')->join('users u', 'u.id = et.user_id')
            ->where('et.establishment_id', $this->establishment->id)
            ->where('et.status !=', 'removed')->get()->result();
        json_success($members);
    }
    public function invite() {
        if (!$this->_method('POST')) return;
        if (!$this->_require_establishment()) return;
        $plan_config = $this->config->item('plans')[$this->establishment->plan];
        if (!$plan_config['team']) return json_error('La gestion d\'équipe nécessite le plan Enterprise', 403);
        $data = $this->_validate_required(array('phone', 'role'));
        if (!$data) return;
        $this->load->model('User_model');
        $user = $this->User_model->get_by_phone($data['phone']);
        if (!$user) return json_error('Utilisateur introuvable avec ce numéro', 404);
        $this->db->insert('establishment_team', array(
            'establishment_id' => $this->establishment->id, 'user_id' => $user->id,
            'role' => $data['role'], 'status' => 'invited',
        ));
        json_success(null, 'Invitation envoyée', 201);
    }
    public function remove($id) {
        if (!$this->_method('DELETE')) return;
        $this->db->where('id', $id)->where('establishment_id', $this->establishment->id)->update('establishment_team', array('status' => 'removed'));
        json_success(null, 'Membre retiré');
    }
}
