<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Message_model extends CI_Model
{
    public function get_by_conversation($conversation_id, $limit = 50, $offset = 0) {
        return $this->db->select('m.*, u.first_name, u.avatar')
            ->from('messages m')->join('users u', 'u.id = m.sender_id')
            ->where('m.conversation_id', $conversation_id)
            ->order_by('m.created_at', 'DESC')
            ->limit($limit, $offset)->get()->result();
    }

    public function send($conversation_id, $sender_id, $content, $type = 'text', $file_url = null) {
        $this->db->insert('messages', array(
            'conversation_id' => $conversation_id, 'sender_id' => $sender_id,
            'content' => $content, 'type' => $type, 'file_url' => $file_url,
        ));
        $this->db->where('id', $conversation_id)->update('conversations', array(
            'last_message' => mb_substr($content, 0, 255), 'last_message_at' => date('Y-m-d H:i:s'),
        ));
        return $this->db->insert_id();
    }

    public function mark_read($conversation_id, $user_id) {
        return $this->db->where('conversation_id', $conversation_id)
            ->where('sender_id !=', $user_id)->where('is_read', 0)
            ->update('messages', array('is_read' => 1, 'read_at' => date('Y-m-d H:i:s')));
    }
}
