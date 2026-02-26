<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Coupon_model extends CI_Model
{
    protected $table = 'coupons';

    public function get_active() {
        return $this->db->where('is_active', 1)->where('expires_at >=', date('Y-m-d H:i:s'))
            ->order_by('expires_at', 'ASC')->get($this->table)->result();
    }

    public function verify($code, $user_id, $subtotal) {
        $coupon = $this->db->where('code', strtoupper($code))->where('is_active', 1)
            ->where('expires_at >=', date('Y-m-d H:i:s'))->get($this->table)->row();

        if (!$coupon) return array('valid' => false, 'message' => 'Code promo invalide ou expiré');
        if ($coupon->min_order > 0 && $subtotal < $coupon->min_order) return array('valid' => false, 'message' => 'Commande minimum : ' . format_price($coupon->min_order));
        if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) return array('valid' => false, 'message' => 'Ce code a atteint sa limite d\'utilisation');

        $user_usage = $this->db->where('coupon_id', $coupon->id)->where('user_id', $user_id)->count_all_results('coupon_usages');
        if ($user_usage >= $coupon->per_user_limit) return array('valid' => false, 'message' => 'Vous avez déjà utilisé ce code');

        $discount = 0;
        if ($coupon->type === 'percentage') { $discount = floor($subtotal * $coupon->value / 100); }
        elseif ($coupon->type === 'fixed') { $discount = $coupon->value; }
        if ($coupon->max_discount && $discount > $coupon->max_discount) $discount = $coupon->max_discount;

        return array('valid' => true, 'coupon' => $coupon, 'discount' => $discount);
    }

    public function use_coupon($coupon_id, $user_id, $order_id, $discount_amount) {
        $this->db->where('id', $coupon_id)->set('used_count', 'used_count+1', false)->update($this->table);
        $this->db->insert('coupon_usages', array(
            'coupon_id' => $coupon_id, 'user_id' => $user_id, 'order_id' => $order_id, 'discount_amount' => $discount_amount,
        ));
    }

    public function create($data) { $this->db->insert($this->table, $data); return $this->db->insert_id(); }
    public function delete($id) { return $this->db->where('id', $id)->delete($this->table); }
}
