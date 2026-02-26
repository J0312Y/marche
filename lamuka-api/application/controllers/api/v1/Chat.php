<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Chat extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model(array('Conversation_model', 'Message_model')); }
    public function conversations() { json_success($this->Conversation_model->get_by_user($this->user_id)); }
    public function messages($conv_id) { $p = get_pagination(); json_success($this->Message_model->get_by_conversation($conv_id, $p['limit'], $p['offset'])); }
    public function send($conv_id) {
        if (!$this->_method('POST')) return;
        $data = $this->_validate_required(array('content'));
        if (!$data) return;
        $id = $this->Message_model->send($conv_id, $this->user_id, $data['content'], isset($data['type']) ? $data['type'] : 'text');
        json_success(array('id' => $id), 'Message envoyé', 201);
    }
    public function mark_read($conv_id) {
        if (!$this->_method('PUT')) return;
        $this->Message_model->mark_read($conv_id, $this->user_id);
        json_success(null, 'Conversation marquée comme lue');
    }
}
