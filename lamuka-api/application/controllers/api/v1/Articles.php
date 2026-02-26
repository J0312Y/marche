<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Articles extends API_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Article_model'); }

    public function index() {
        $filters = array(
            'search'           => $this->input->get('search'),
            'category_id'      => $this->input->get('category_id'),
            'establishment_id' => $this->input->get('establishment_id'),
            'type'             => $this->input->get('type'),
            'min_price'        => $this->input->get('min_price'),
            'max_price'        => $this->input->get('max_price'),
            'sort'             => $this->input->get('sort'),
        );
        $p = get_pagination();
        $total = $this->Article_model->count_search($filters);
        $items = $this->Article_model->search($filters)->limit($p['limit'], $p['offset'])->get()->result();
        json_success(array('articles' => $items, 'pagination' => pagination_meta($total, $p['page'], $p['limit'])));
    }

    public function detail($id) {
        $article = $this->Article_model->get($id);
        if (!$article) return json_error('Article introuvable', 404);
        $images = $this->Article_model->get_images($id);
        $this->_authenticate_optional();
        $is_fav = false;
        if ($this->user_id) { $this->load->model('Favorite_model'); $is_fav = $this->Favorite_model->is_fav($this->user_id, $id); }
        json_success(array('article' => $article, 'images' => $images, 'is_favorite' => $is_fav));
    }

    public function popular() { json_success($this->Article_model->popular()); }

    public function flash() { $this->load->model('Flash_sale_model'); json_success($this->Flash_sale_model->get_active()); }
}
