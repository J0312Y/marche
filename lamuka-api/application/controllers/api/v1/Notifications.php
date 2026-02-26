<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Notifications extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Notification_model'); }
    public function index() {
        $unread = $this->input->get('unread_only'); $p = get_pagination();
        json_success($this->Notification_model->get_by_user($this->user_id, (bool)$unread, $p['limit'], $p['offset']));
    }
    public function count() { json_success(array('unread' => $this->Notification_model->count_unread($this->user_id))); }
    public function read($id) { if (!$this->_method('PUT')) return; $this->Notification_model->mark_read($id, $this->user_id); json_success(null, 'Notification lue'); }
    public function read_all() { if (!$this->_method('PUT')) return; $this->Notification_model->mark_all_read($this->user_id); json_success(null, 'Toutes les notifications lues'); }
}
