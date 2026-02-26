<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cart_model extends CI_Model
{
    protected $table = 'cart_items';

    public function get_by_user($user_id) {
        return $this->db->select('ci.*, a.name, a.price, a.old_price, a.image, a.stock, e.name as establishment_name, e.id as establishment_id')
            ->from($this->table . ' ci')
            ->join('articles a', 'a.id = ci.article_id')
            ->join('establishments e', 'e.id = a.establishment_id')
            ->where('ci.user_id', $user_id)
            ->where('a.is_active', 1)
            ->get()->result();
    }

    public function add($user_id, $article_id, $quantity = 1, $note = null) {
        $existing = $this->db->where('user_id', $user_id)->where('article_id', $article_id)->get($this->table)->row();
        if ($existing) {
            return $this->db->where('id', $existing->id)->update($this->table, array(
                'quantity' => $existing->quantity + $quantity,
                'note'     => $note ?: $existing->note,
            ));
        }
        $this->db->insert($this->table, array(
            'user_id'    => $user_id,
            'article_id' => $article_id,
            'quantity'   => $quantity,
            'note'       => $note,
        ));
        return $this->db->insert_id();
    }

    public function update_qty($id, $user_id, $quantity) {
        return $this->db->where('id', $id)->where('user_id', $user_id)->update($this->table, array('quantity' => $quantity));
    }

    public function remove($id, $user_id) {
        return $this->db->where('id', $id)->where('user_id', $user_id)->delete($this->table);
    }

    public function clear($user_id) {
        return $this->db->where('user_id', $user_id)->delete($this->table);
    }

    public function count($user_id) {
        return $this->db->where('user_id', $user_id)->count_all_results($this->table);
    }
}
