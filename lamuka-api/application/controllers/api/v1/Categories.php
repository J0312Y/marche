<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Categories extends API_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Category_model'); }

    public function index() {
        $type = $this->input->get('type');
        json_success($this->Category_model->get_with_count($type));
    }

    public function detail($id) {
        $cat = $this->Category_model->get($id);
        if (!$cat) return json_error('Catégorie introuvable', 404);
        $this->load->model('Article_model');
        $p = get_pagination();
        $articles = $this->Article_model->search(array('category_id' => $id))->limit($p['limit'], $p['offset'])->get()->result();
        $total = $this->Article_model->count_search(array('category_id' => $id));
        json_success(array('category' => $cat, 'articles' => $articles, 'pagination' => pagination_meta($total, $p['page'], $p['limit'])));
    }
}
