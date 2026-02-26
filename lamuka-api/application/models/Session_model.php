<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Session_model extends CI_Model
{
    protected $table = 'sessions';

    public function create($user_id, $token, $device_info = null)
    {
        $this->db->insert($this->table, array(
            'user_id'     => $user_id,
            'token'       => $token,
            'device_info' => $device_info,
            'ip_address'  => get_client_ip(),
            'expires_at'  => date('Y-m-d H:i:s', strtotime('+30 days')),
        ));
        return $this->db->insert_id();
    }

    public function get_active_by_token($token)
    {
        return $this->db->where('token', $token)
            ->where('is_active', 1)
            ->where('expires_at >=', date('Y-m-d H:i:s'))
            ->get($this->table)
            ->row();
    }

    public function update_activity($id)
    {
        return $this->db->where('id', $id)
            ->update($this->table, array('last_activity' => date('Y-m-d H:i:s')));
    }

    public function deactivate($token)
    {
        return $this->db->where('token', $token)
            ->update($this->table, array('is_active' => 0));
    }

    public function deactivate_all($user_id)
    {
        return $this->db->where('user_id', $user_id)
            ->update($this->table, array('is_active' => 0));
    }
}
