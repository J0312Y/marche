<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Orders extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model(array('Order_model', 'Cart_model', 'Coupon_model')); }

    public function index() { $this->_route_method('_list', '_create'); }

    private function _list() {
        $status = $this->input->get('status');
        $p = get_pagination();
        json_success($this->Order_model->get_by_user($this->user_id, $status, $p['limit'], $p['offset']));
    }

    private function _create() {
        $data = $this->_validate_required(array('address_id', 'payment_method'));
        if (!$data) return;

        // Récupérer le panier
        $cart = $this->Cart_model->get_by_user($this->user_id);
        if (empty($cart)) return json_error('Votre panier est vide', 422);

        // Grouper par établissement
        $groups = array();
        foreach ($cart as $item) {
            $eid = $item->establishment_id;
            if (!isset($groups[$eid])) $groups[$eid] = array('items' => array(), 'subtotal' => 0, 'name' => $item->establishment_name);
            $groups[$eid]['items'][] = $item;
            $groups[$eid]['subtotal'] += $item->price * $item->quantity;
        }

        // Vérifier coupon
        $discount = 0; $coupon = null;
        if (!empty($data['coupon_code'])) {
            $total_subtotal = array_sum(array_column($groups, 'subtotal'));
            $verify = $this->Coupon_model->verify($data['coupon_code'], $this->user_id, $total_subtotal);
            if (!$verify['valid']) return json_error($verify['message'], 422);
            $coupon = $verify['coupon']; $discount = $verify['discount'];
        }

        $orders_created = array();

        // Créer une commande par établissement
        foreach ($groups as $eid => $group) {
            $delivery_fee = 1000; // TODO: calculer dynamiquement
            $order_discount = count($groups) === 1 ? $discount : 0;
            $total = $group['subtotal'] + $delivery_fee - $order_discount;

            $order_id = $this->Order_model->create(array(
                'user_id'          => $this->user_id,
                'establishment_id' => $eid,
                'address_id'       => $data['address_id'],
                'subtotal'         => $group['subtotal'],
                'delivery_fee'     => $delivery_fee,
                'discount'         => $order_discount,
                'total'            => max(0, $total),
                'coupon_id'        => $coupon ? $coupon->id : null,
                'payment_method'   => $data['payment_method'],
                'note'             => isset($data['note']) ? $data['note'] : null,
            ));

            // Ajouter les items
            foreach ($group['items'] as $item) {
                $this->Order_model->add_item(array(
                    'order_id'      => $order_id,
                    'article_id'    => $item->article_id,
                    'article_name'  => $item->name,
                    'article_price' => $item->price,
                    'quantity'      => $item->quantity,
                    'subtotal'      => $item->price * $item->quantity,
                ));
            }

            // Tracking initial
            $this->Order_model->add_tracking($order_id, 'pending', 'Commande créée');

            // Créer la livraison
            $this->load->model('Delivery_model');
            $this->Delivery_model->create(array(
                'order_id'    => $order_id,
                'pickup_code' => generate_delivery_code(),
                'delivery_code' => generate_delivery_code(),
            ));

            $orders_created[] = $order_id;

            // Notification au vendeur
            $this->load->library('Push_lib');
            $estab = $this->db->get_where('establishments', array('id' => $eid))->row();
            if ($estab) {
                $this->push_lib->notify($estab->owner_id, 'order', '🛍️ Nouvelle commande !',
                    "Commande de " . format_price($total), array('order_id' => $order_id), '📦');
            }
        }

        // Utiliser le coupon
        if ($coupon && !empty($orders_created)) {
            $this->Coupon_model->use_coupon($coupon->id, $this->user_id, $orders_created[0], $discount);
        }

        // Vider le panier
        $this->Cart_model->clear($this->user_id);

        json_success(array('order_ids' => $orders_created), 'Commande créée avec succès', 201);
    }

    public function detail($id) {
        $order = $this->Order_model->get($id);
        if (!$order || $order->user_id != $this->user_id) return json_error('Commande introuvable', 404);
        $items = $this->Order_model->get_items($id);
        json_success(array('order' => $order, 'items' => $items));
    }

    public function cancel($id) {
        if (!$this->_method('PUT')) return;
        $order = $this->Order_model->get($id);
        if (!$order || $order->user_id != $this->user_id) return json_error('Commande introuvable', 404);
        if (!in_array($order->status, array('pending', 'confirmed'))) return json_error('Cette commande ne peut plus être annulée', 422);
        $data = get_json_input();
        $this->Order_model->update_status($id, 'cancelled');
        $this->db->where('id', $id)->update('orders', array('cancel_reason' => isset($data['reason']) ? $data['reason'] : null));
        json_success(null, 'Commande annulée');
    }

    public function track($id) {
        $order = $this->Order_model->get($id);
        if (!$order || $order->user_id != $this->user_id) return json_error('Commande introuvable', 404);
        $tracking = $this->db->where('order_id', $id)->order_by('created_at', 'ASC')->get('order_tracking')->result();
        $delivery = $this->db->get_where('deliveries', array('order_id' => $id))->row();
        $driver = null;
        if ($delivery && $delivery->driver_id) {
            $driver = $this->db->select('dp.*, u.first_name, u.last_name, u.phone, u.avatar')
                ->from('driver_profiles dp')->join('users u', 'u.id = dp.user_id')
                ->where('dp.id', $delivery->driver_id)->get()->row();
        }
        json_success(array('order' => $order, 'tracking' => $tracking, 'delivery' => $delivery, 'driver' => $driver));
    }
}
