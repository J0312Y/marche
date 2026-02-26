<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Shops extends Vendor_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Establishment_model'); }

    public function index() { $this->_route_method('_list', '_create'); }

    private function _list() { json_success($this->Establishment_model->get_shops_by_owner($this->user_id)); }

    private function _create() {
        $data = $this->_validate_required(array('name', 'type'));
        if (!$data) return;
        // Vérifier limite multi-shop
        $plan_config = $this->config->item('plans')[$this->establishment->plan ?? 'starter'];
        $count = count($this->Establishment_model->get_shops_by_owner($this->user_id));
        if ($count >= $plan_config['max_shops']) return json_error("Limite de boutiques atteinte ({$plan_config['max_shops']}) pour votre plan", 403);

        $slug = generate_unique_slug($data['name'], 'establishments');
        $id = $this->Establishment_model->create(array(
            'owner_id' => $this->user_id, 'name' => $data['name'], 'slug' => $slug,
            'type' => $data['type'], 'plan' => $this->establishment->plan, 'status' => 'pending',
            'description' => isset($data['description']) ? $data['description'] : null,
        ));
        json_success(array('id' => $id), 'Boutique créée', 201);
    }

    public function item($id) {
        if (request_method() === 'GET') {
            $shop = $this->Establishment_model->get_by_owner($this->user_id, $id);
            if (!$shop) return json_error('Boutique introuvable', 404);
            json_success($shop);
        } elseif (request_method() === 'PUT') {
            $data = get_json_input();
            $allowed = array('name','description','phone','email','address','city','latitude','longitude');
            $update = array_intersect_key($data, array_flip($allowed));
            $this->Establishment_model->update($id, $update);
            json_success(null, 'Boutique mise à jour');
        }
    }
}
