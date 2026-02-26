<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Wallet_model extends CI_Model
{
    public function get_or_create($user_id) {
        $wallet = $this->db->get_where('wallets', array('user_id' => $user_id))->row();
        if (!$wallet) {
            $this->db->insert('wallets', array('user_id' => $user_id));
            $wallet = $this->db->get_where('wallets', array('user_id' => $user_id))->row();
        }
        return $wallet;
    }

    public function credit($user_id, $amount, $description = '', $reference = null) {
        $wallet = $this->get_or_create($user_id);
        $new_balance = $wallet->balance + $amount;
        $this->db->where('id', $wallet->id)->update('wallets', array(
            'balance' => $new_balance, 'total_earned' => $wallet->total_earned + $amount,
        ));
        $this->db->insert('wallet_transactions', array(
            'wallet_id' => $wallet->id, 'type' => 'credit', 'amount' => $amount,
            'description' => $description, 'reference' => $reference, 'balance_after' => $new_balance,
        ));
        return $new_balance;
    }

    public function debit($user_id, $amount, $description = '', $reference = null) {
        $wallet = $this->get_or_create($user_id);
        if ($wallet->balance < $amount) return false;
        $new_balance = $wallet->balance - $amount;
        $this->db->where('id', $wallet->id)->update('wallets', array(
            'balance' => $new_balance, 'total_withdrawn' => $wallet->total_withdrawn + $amount,
        ));
        $this->db->insert('wallet_transactions', array(
            'wallet_id' => $wallet->id, 'type' => 'debit', 'amount' => $amount,
            'description' => $description, 'reference' => $reference, 'balance_after' => $new_balance,
        ));
        return $new_balance;
    }

    public function transactions($user_id, $type = null, $limit = 20, $offset = 0) {
        $wallet = $this->get_or_create($user_id);
        $this->db->where('wallet_id', $wallet->id);
        if ($type) $this->db->where('type', $type);
        return $this->db->order_by('created_at', 'DESC')->limit($limit, $offset)->get('wallet_transactions')->result();
    }
}
