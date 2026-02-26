<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cart extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Cart_model'); }

    public function index() { $this->_route_method('_list', '_add', null, '_clear'); }

    private function _list() {
        $items = $this->Cart_model->get_by_user($this->user_id);
        $subtotal = 0;
        foreach ($items as $item) { $subtotal += $item->price * $item->quantity; }
        json_success(array('items' => $items, 'subtotal' => $subtotal, 'count' => count($items)));
    }

    private function _add() {
        $data = $this->_validate_required(array('article_id', 'quantity'));
        if (!$data) return;
        $this->Cart_model->add($this->user_id, $data['article_id'], $data['quantity'], isset($data['note']) ? $data['note'] : null);
        json_success(null, 'Article ajouté au panier', 201);
    }

    private function _clear() { $this->Cart_model->clear($this->user_id); json_success(null, 'Panier vidé'); }

    public function item($id) { $this->_route_method(null, null, '_update_item', '_remove_item'); }

    private function _update_item() {
        $id = $this->uri->segment(4);
        $data = $this->_validate_required(array('quantity'));
        if (!$data) return;
        $this->Cart_model->update_qty($id, $this->user_id, $data['quantity']);
        json_success(null, 'Quantité mise à jour');
    }

    private function _remove_item() {
        $id = $this->uri->segment(4);
        $this->Cart_model->remove($id, $this->user_id);
        json_success(null, 'Article retiré');
    }

    public function count() { json_success(array('count' => $this->Cart_model->count($this->user_id))); }
}
