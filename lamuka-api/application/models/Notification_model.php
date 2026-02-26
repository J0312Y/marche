<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Notification_model extends CI_Model
{
    protected $table = 'notifications';

    public function get_by_user($user_id, $unread_only = false, $limit = 30, $offset = 0) {
        $this->db->where('user_id', $user_id);
        if ($unread_only) $this->db->where('is_read', 0);
        return $this->db->order_by('created_at', 'DESC')->limit($limit, $offset)->get($this->table)->result();
    }

    public function count_unread($user_id) { return $this->db->where('user_id', $user_id)->where('is_read', 0)->count_all_results($this->table); }

    public function mark_read($id, $user_id) { return $this->db->where('id', $id)->where('user_id', $user_id)->update($this->table, array('is_read' => 1, 'read_at' => date('Y-m-d H:i:s'))); }

    public function mark_all_read($user_id) { return $this->db->where('user_id', $user_id)->where('is_read', 0)->update($this->table, array('is_read' => 1, 'read_at' => date('Y-m-d H:i:s'))); }
}
