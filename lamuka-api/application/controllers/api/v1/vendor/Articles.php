<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Articles extends Vendor_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Article_model'); }

    public function index() { $this->_route_method('_list', '_create'); }

    private function _list() {
        if (!$this->_require_establishment()) return;
        json_success($this->Article_model->by_establishment($this->establishment->id, 500));
    }

    private function _create() {
        if (!$this->_require_establishment()) return;
        $data = $this->_validate_required(array('name', 'price'));
        if (!$data) return;

        // Vérifier les limites du plan
        $plan = $this->config->item('plans')[$this->establishment->plan] ?? null;
        if ($plan && $plan['max_articles'] > 0) {
            $count = $this->db->where('establishment_id', $this->establishment->id)->count_all_results('articles');
            if ($count >= $plan['max_articles']) return json_error("Limite d'articles atteinte pour votre plan ({$plan['max_articles']})", 403);
        }

        $slug = generate_unique_slug($data['name'], 'articles');
        $id = $this->Article_model->create(array(
            'establishment_id' => $this->establishment->id,
            'category_id'      => isset($data['category_id']) ? $data['category_id'] : null,
            'name'             => $data['name'],
            'slug'             => $slug,
            'description'      => isset($data['description']) ? $data['description'] : null,
            'price'            => (int) $data['price'],
            'old_price'        => isset($data['old_price']) ? (int)$data['old_price'] : null,
            'stock'            => isset($data['stock']) ? (int)$data['stock'] : -1,
            'tags'             => isset($data['tags']) ? json_encode($data['tags']) : null,
        ));

        json_success(array('id' => $id), 'Article créé', 201);
    }

    public function item($id) { $this->_route_method(null, null, '_update', '_delete'); }

    private function _update() {
        $id = $this->uri->segment(5);
        $data = get_json_input();
        $allowed = array('name','description','price','old_price','category_id','stock','tags','is_active','is_featured');
        $update = array_intersect_key($data, array_flip($allowed));
        if (isset($update['tags'])) $update['tags'] = json_encode($update['tags']);
        $this->Article_model->update($id, $update);
        json_success(null, 'Article mis à jour');
    }

    private function _delete() { $id = $this->uri->segment(5); $this->Article_model->delete($id); json_success(null, 'Article supprimé'); }
}
