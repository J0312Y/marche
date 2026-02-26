<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends Vendor_Controller
{
    public function __construct() { parent::__construct(); $this->load->model(array('Order_model', 'Establishment_model')); }

    public function register() {
        if (!$this->_method('POST')) return;
        $data = $this->_validate_required(array('name', 'type'));
        if (!$data) return;

        $slug = generate_unique_slug($data['name'], 'establishments');
        $id = $this->Establishment_model->create(array(
            'owner_id'    => $this->user_id,
            'name'        => $data['name'],
            'slug'        => $slug,
            'description' => isset($data['description']) ? $data['description'] : null,
            'type'        => $data['type'],
            'plan'        => isset($data['plan']) ? $data['plan'] : 'starter',
            'status'      => 'pending',
        ));

        // Mettre à jour le rôle de l'utilisateur
        $this->load->model('User_model');
        $user = $this->User_model->get($this->user_id);
        $new_role = ($user->role === 'driver') ? 'both' : 'vendor';
        $this->User_model->set_role($this->user_id, $new_role);

        // Créer le wallet
        $this->load->model('Wallet_model');
        $this->Wallet_model->get_or_create($this->user_id);

        json_success(array('establishment_id' => $id, 'slug' => $slug), 'Inscription vendeur soumise', 201);
    }

    public function index() {
        if (!$this->_require_establishment()) return;
        $e = $this->establishment;
        $period = $this->input->get('period') ?: 'month';

        $revenue = $this->Order_model->revenue_by_establishment($e->id, $period);
        $orders_count = $this->Order_model->count_by_establishment($e->id);
        $pending_count = $this->Order_model->count_by_establishment($e->id, 'pending');

        json_success(array(
            'establishment' => $e,
            'revenue'       => $revenue,
            'total_orders'  => $orders_count,
            'pending_orders' => $pending_count,
            'period'        => $period,
        ));
    }
}
