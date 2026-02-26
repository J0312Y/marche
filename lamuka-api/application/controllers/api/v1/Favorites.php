<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Favorites extends Auth_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Favorite_model'); }
    public function index() { json_success($this->Favorite_model->get_by_user($this->user_id)); }
    public function toggle($article_id) {
        if (!$this->_method('POST')) return;
        $added = $this->Favorite_model->toggle($this->user_id, $article_id);
        json_success(array('is_favorite' => $added), $added ? 'Ajouté aux favoris' : 'Retiré des favoris');
    }
}
