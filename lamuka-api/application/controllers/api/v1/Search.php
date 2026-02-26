<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Search Controller — Historique de recherches & récemment vus
 * GET    /api/v1/search/history
 * DELETE /api/v1/search/history
 * POST   /api/v1/search/viewed/:article_id
 * GET    /api/v1/search/viewed
 */
class Search extends Auth_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Search_model');
    }

    /**
     * GET /search/history — Historique de recherches
     * DELETE /search/history — Effacer l'historique
     */
    public function history()
    {
        if (request_method() === 'DELETE') {
            $this->Search_model->clear_history($this->user_id);
            return json_success(null, 'Historique effacé');
        }

        json_success($this->Search_model->get_history($this->user_id));
    }

    /**
     * POST /search/viewed/:article_id — Marquer comme vu
     * GET  /search/viewed — Articles récemment vus
     */
    public function viewed($article_id = null)
    {
        if (request_method() === 'POST' && $article_id) {
            $this->Search_model->add_recently_viewed($this->user_id, $article_id);
            return json_success(null, 'Vu');
        }

        json_success($this->Search_model->get_recently_viewed($this->user_id));
    }
}
