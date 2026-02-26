<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model
{
    protected $table = 'users';

    public function get($id)
    {
        return $this->db->get_where($this->table, array('id' => $id))->row();
    }

    public function get_by_phone($phone)
    {
        return $this->db->get_where($this->table, array('phone' => $phone))->row();
    }

    public function get_by_email($email)
    {
        return $this->db->get_where($this->table, array('email' => $email))->row();
    }

    public function create($data)
    {
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function update($id, $data)
    {
        $data['updated_at'] = date('Y-m-d H:i:s');
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    public function update_last_login($id)
    {
        return $this->update($id, array('last_login' => date('Y-m-d H:i:s')));
    }

    public function set_role($id, $role)
    {
        return $this->update($id, array('role' => $role));
    }

    public function profile($id)
    {
        return $this->db->select('id, phone, email, first_name, last_name, avatar, gender, birth_date, role, lang, currency, created_at')
            ->get_where($this->table, array('id' => $id))
            ->row();
    }

    public function delete($id)
    {
        return $this->db->where('id', $id)->delete($this->table);
    }
}
