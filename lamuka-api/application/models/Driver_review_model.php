<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Driver_review_model extends CI_Model
{
    protected $table = 'driver_reviews';

    public function create($data)
    {
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert($this->table, $data);
        $id = $this->db->insert_id();

        // Mettre à jour la note moyenne du livreur
        $this->update_driver_rating($data['driver_id']);

        // Si pourboire
        if (!empty($data['tip_amount']) && $data['tip_amount'] > 0) {
            $this->load->model('Wallet_model');
            $driver = $this->db->get_where('driver_profiles', array('id' => $data['driver_id']))->row();
            if ($driver) {
                $this->Wallet_model->credit($driver->user_id, $data['tip_amount'], 'Pourboire livraison #' . $data['delivery_id']);
            }
        }

        return $id;
    }

    public function get_by_driver($driver_id, $limit = 20, $offset = 0)
    {
        return $this->db->select('dr.*, u.first_name, u.last_name, u.avatar')
            ->from($this->table . ' dr')
            ->join('users u', 'u.id = dr.user_id')
            ->where('dr.driver_id', $driver_id)
            ->order_by('dr.created_at', 'DESC')
            ->limit($limit, $offset)
            ->get()->result();
    }

    public function has_reviewed($user_id, $delivery_id)
    {
        return $this->db->where('user_id', $user_id)
            ->where('delivery_id', $delivery_id)
            ->count_all_results($this->table) > 0;
    }

    private function update_driver_rating($driver_id)
    {
        $stats = $this->db->select('AVG(rating) as avg_rating')
            ->from($this->table)
            ->where('driver_id', $driver_id)
            ->get()->row();

        if ($stats && $stats->avg_rating) {
            $this->db->where('id', $driver_id)
                ->update('driver_profiles', array('avg_rating' => round($stats->avg_rating, 1)));
        }
    }
}
