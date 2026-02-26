<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends Driver_Controller
{
    public function __construct() { parent::__construct(); $this->load->model(array('Driver_model', 'Delivery_model')); }

    public function register() {
        if (!$this->_method('POST')) return;
        $data = $this->_validate_required(array('vehicle_type'));
        if (!$data) return;

        $driver_id = $this->Driver_model->create(array(
            'user_id'       => $this->user_id,
            'vehicle_type'  => $data['vehicle_type'],
            'vehicle_plate' => isset($data['vehicle_plate']) ? $data['vehicle_plate'] : null,
            'vehicle_brand' => isset($data['vehicle_brand']) ? $data['vehicle_brand'] : null,
            'status'        => 'pending',
        ));

        // Ajouter les zones
        if (isset($data['zones']) && is_array($data['zones'])) {
            foreach ($data['zones'] as $zone) {
                $this->Driver_model->add_zone($driver_id, $zone);
            }
        }

        // Mettre à jour le rôle
        $this->load->model('User_model');
        $user = $this->User_model->get($this->user_id);
        $new_role = ($user->role === 'vendor') ? 'both' : 'driver';
        $this->User_model->set_role($this->user_id, $new_role);

        // Créer le wallet
        $this->load->model('Wallet_model');
        $this->Wallet_model->get_or_create($this->user_id);

        json_success(array('driver_id' => $driver_id), 'Inscription livreur soumise', 201);
    }

    public function index() {
        if (!$this->_require_driver()) return;
        $active = $this->Delivery_model->get_active_by_driver($this->driver->id);
        $stats = $this->Driver_model->stats($this->driver->id, 'today');
        json_success(array(
            'driver'    => $this->driver,
            'active'    => $active,
            'today'     => $stats,
        ));
    }
}
