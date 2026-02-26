<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reviews extends API_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Review_model'); }

    public function index() {
        $this->_route_method('_list', '_create');
    }

    private function _list() {
        $article_id = $this->input->get('article_id');
        $establishment_id = $this->input->get('establishment_id');
        $sort = $this->input->get('sort') ?: 'newest';
        $p = get_pagination();
        if ($article_id) { $reviews = $this->Review_model->get_by_article($article_id, $p['limit'], $p['offset'], $sort); }
        elseif ($establishment_id) { $reviews = $this->Review_model->get_by_establishment($establishment_id, $p['limit'], $p['offset']); }
        else { return json_error('article_id ou establishment_id requis', 422); }
        json_success($reviews);
    }

    private function _create() {
        $this->auth_required = true; $this->_authenticate();
        $data = $this->_validate_required(array('rating'));
        if (!$data) return;
        $insert = array(
            'user_id' => $this->user_id, 'rating' => max(1, min(5, (int)$data['rating'])),
            'comment' => isset($data['comment']) ? $data['comment'] : null,
            'article_id' => isset($data['article_id']) ? $data['article_id'] : null,
            'establishment_id' => isset($data['establishment_id']) ? $data['establishment_id'] : null,
        );
        $id = $this->Review_model->create($insert);
        if ($insert['article_id']) { $this->load->model('Article_model'); $this->Article_model->update_rating($insert['article_id']); }
        if ($insert['establishment_id']) { $this->load->model('Establishment_model'); $this->Establishment_model->update_rating($insert['establishment_id']); }
        json_success(array('id' => $id), 'Avis publié', 201);
    }

    public function stats($article_id) { json_success($this->Review_model->stats($article_id)); }
}
