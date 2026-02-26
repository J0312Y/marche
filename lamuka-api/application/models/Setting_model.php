<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Setting_model extends CI_Model
{
    public function get($key, $default = null) {
        $row = $this->db->get_where('settings', array('key' => $key))->row();
        return $row ? $row->value : $default;
    }

    public function set($key, $value, $group = 'general') {
        $exists = $this->db->get_where('settings', array('key' => $key))->row();
        if ($exists) return $this->db->where('key', $key)->update('settings', array('value' => $value));
        return $this->db->insert('settings', array('key' => $key, 'value' => $value, 'group' => $group));
    }

    public function get_group($group) { return $this->db->where('group', $group)->get('settings')->result(); }
}
