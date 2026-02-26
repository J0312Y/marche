<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Followers extends Vendor_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Follower_model');
    }

    public function index()
    {
        if (!$this->_require_establishment()) return;
        $p = get_pagination();
        $followers = $this->Follower_model->get_followers($this->establishment->id, $p['limit'], $p['offset']);
        $total = $this->Follower_model->count($this->establishment->id);
        json_success(array(
            'followers' => $followers,
            'total'     => $total,
        ));
    }
}
