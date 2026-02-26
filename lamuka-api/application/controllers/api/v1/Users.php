<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Users extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('User_model'); }

    public function me() {
        $this->_route_method('_get_me', '_update_me', '_update_me');
    }

    private function _get_me() { json_success($this->User_model->profile($this->user_id)); }

    private function _update_me() {
        $data = get_json_input();
        $allowed = array('first_name','last_name','email','gender','birth_date','lang','currency');
        $update = array_intersect_key($data, array_flip($allowed));
        if (empty($update)) return json_error('Aucune donnée à mettre à jour', 422);
        $this->User_model->update($this->user_id, $update);
        json_success($this->User_model->profile($this->user_id), 'Profil mis à jour');
    }

    public function password() {
        if (!$this->_method('PUT')) return;
        $data = $this->_validate_required(array('new_password'));
        if (!$data) return;
        if (strlen($data['new_password']) < 6) return json_error('Le mot de passe doit contenir au moins 6 caractères', 422);
        $this->User_model->update($this->user_id, array('password' => password_hash($data['new_password'], PASSWORD_DEFAULT)));
        json_success(null, 'Mot de passe mis à jour');
    }

    public function avatar() {
        if (!$this->_method('POST')) return;
        $this->load->library('Upload_lib');
        $result = $this->upload_lib->upload_image('avatar', 'avatars');
        if (!$result['success']) return json_error($result['message'], 422);
        $this->User_model->update($this->user_id, array('avatar' => $result['url']));
        json_success(array('avatar' => $result['url']), 'Avatar mis à jour');
    }
}
