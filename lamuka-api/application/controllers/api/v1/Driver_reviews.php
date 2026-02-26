<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Driver_reviews Controller — Noter un livreur après livraison
 * POST /api/v1/driver-reviews
 * GET  /api/v1/driver-reviews/:driver_id
 */
class Driver_reviews extends Auth_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Driver_review_model');
    }

    /**
     * POST / GET
     */
    public function index()
    {
        $this->_route_method('_list', '_create');
    }

    /**
     * GET — Avis sur un livreur
     */
    private function _list()
    {
        $driver_id = $this->input->get('driver_id');
        if (!$driver_id) return json_error('driver_id requis', 422);

        $p = get_pagination();
        $reviews = $this->Driver_review_model->get_by_driver($driver_id, $p['limit'], $p['offset']);
        json_success($reviews);
    }

    /**
     * POST — Noter un livreur
     */
    private function _create()
    {
        $data = $this->_validate_required(array('delivery_id', 'rating'));
        if (!$data) return;

        // Vérifier la livraison
        $this->load->model('Delivery_model');
        $delivery = $this->Delivery_model->get($data['delivery_id']);

        if (!$delivery) return json_error('Livraison introuvable', 404);
        if ($delivery->status !== 'delivered') return json_error('La livraison n\'est pas encore terminée', 422);

        // Vérifier que c'est bien le client de la commande
        $order = $this->db->get_where('orders', array('id' => $delivery->order_id))->row();
        if (!$order || $order->user_id != $this->user_id) return json_error('Vous ne pouvez noter que vos propres livraisons', 403);

        // Vérifier si déjà noté
        if ($this->Driver_review_model->has_reviewed($this->user_id, $data['delivery_id'])) {
            return json_error('Vous avez déjà noté cette livraison', 422);
        }

        $id = $this->Driver_review_model->create(array(
            'user_id'     => $this->user_id,
            'driver_id'   => $delivery->driver_id,
            'delivery_id' => $data['delivery_id'],
            'order_id'    => $delivery->order_id,
            'rating'      => max(1, min(5, (int) $data['rating'])),
            'comment'     => isset($data['comment']) ? $data['comment'] : null,
            'tip_amount'  => isset($data['tip_amount']) ? (int) $data['tip_amount'] : 0,
        ));

        // Notification au livreur
        $this->load->library('Push_lib');
        $driver = $this->db->select('user_id')->from('driver_profiles')->where('id', $delivery->driver_id)->get()->row();
        if ($driver) {
            $stars = str_repeat('⭐', (int) $data['rating']);
            $msg = $stars . ' ' . $this->user->first_name . ' vous a noté';
            if (!empty($data['tip_amount'])) $msg .= ' + pourboire de ' . format_price($data['tip_amount']);
            $this->push_lib->notify($driver->user_id, 'review', '⭐ Nouvelle note', $msg, array('delivery_id' => $data['delivery_id']), '⭐');
        }

        json_success(array('id' => $id), 'Merci pour votre avis !', 201);
    }
}
