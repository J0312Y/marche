<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Establishments extends API_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Establishment_model'); }

    public function index() {
        $filters = array(
            'type'   => $this->input->get('type'),
            'city'   => $this->input->get('city'),
            'search' => $this->input->get('search'),
            'sort'   => $this->input->get('sort'),
        );
        $p = get_pagination();
        $total = $this->Establishment_model->count_all($filters);
        $items = $this->Establishment_model->get_all($filters)->limit($p['limit'], $p['offset'])->get()->result();
        json_success(array('establishments' => $items, 'pagination' => pagination_meta($total, $p['page'], $p['limit'])));
    }

    public function detail($id) {
        $estab = $this->Establishment_model->get($id);
        if (!$estab) return json_error('Établissement introuvable', 404);
        $hours = $this->db->where('establishment_id', $id)->get('establishment_hours')->result();
        json_success(array('establishment' => $estab, 'hours' => $hours));
    }

    public function articles($id) {
        $this->load->model('Article_model');
        $p = get_pagination();
        $articles = $this->Article_model->by_establishment($id, $p['limit'], $p['offset']);
        json_success(array('articles' => $articles));
    }

    public function nearby() {
        $lat = $this->input->get('lat'); $lng = $this->input->get('lng');
        $radius = $this->input->get('radius') ?: 10;
        if (!$lat || !$lng) return json_error('Coordonnées GPS requises (lat, lng)', 422);
        $this->load->library('Geolocation_lib');
        $this->geolocation_lib->nearby_query($lat, $lng, $radius);
        $results = $this->db->from('establishments')->where('status', 'active')->limit(20)->get()->result();
        json_success($results);
    }
}
