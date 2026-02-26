<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Otp_model extends CI_Model
{
    protected $table = 'otp_codes';

    public function create($phone, $code, $type = 'login')
    {
        // Invalider les anciens OTP
        $this->db->where('phone', $phone)->where('verified', 0)->delete($this->table);

        $this->db->insert($this->table, array(
            'phone'      => $phone,
            'code'       => $code,
            'type'       => $type,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+10 minutes')),
        ));
        return $this->db->insert_id();
    }

    public function verify($phone, $code)
    {
        $otp = $this->db->where('phone', $phone)
            ->where('code', $code)
            ->where('verified', 0)
            ->where('expires_at >=', date('Y-m-d H:i:s'))
            ->where('attempts <', 5)
            ->order_by('id', 'DESC')
            ->get($this->table)
            ->row();

        if (!$otp) {
            // Incrémenter les tentatives
            $this->db->where('phone', $phone)->where('verified', 0)
                ->set('attempts', 'attempts+1', false)->update($this->table);
            return false;
        }

        // Marquer comme vérifié
        $this->db->where('id', $otp->id)->update($this->table, array('verified' => 1));
        return true;
    }

    public function cleanup()
    {
        $this->db->where('expires_at <', date('Y-m-d H:i:s'))->delete($this->table);
    }
}
