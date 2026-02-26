<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Conversation_model extends CI_Model
{
    public function get_by_user($user_id) {
        return $this->db->select('c.*, CASE WHEN c.participant_1 = '.$user_id.' THEN u2.first_name ELSE u1.first_name END as other_name, CASE WHEN c.participant_1 = '.$user_id.' THEN u2.avatar ELSE u1.avatar END as other_avatar', false)
            ->from('conversations c')
            ->join('users u1', 'u1.id = c.participant_1')
            ->join('users u2', 'u2.id = c.participant_2')
            ->group_start()->where('c.participant_1', $user_id)->or_where('c.participant_2', $user_id)->group_end()
            ->order_by('c.last_message_at', 'DESC')->get()->result();
    }

    public function get_or_create($user_1, $user_2, $type, $order_id = null) {
        $conv = $this->db->group_start()
            ->group_start()->where('participant_1', $user_1)->where('participant_2', $user_2)->group_end()
            ->or_group_start()->where('participant_1', $user_2)->where('participant_2', $user_1)->group_end()
            ->group_end()->get('conversations')->row();
        if ($conv) return $conv;
        $this->db->insert('conversations', array('type' => $type, 'participant_1' => $user_1, 'participant_2' => $user_2, 'order_id' => $order_id));
        return $this->db->get_where('conversations', array('id' => $this->db->insert_id()))->row();
    }
}
