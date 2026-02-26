<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Driver_model extends CI_Model
{
    protected $table = 'driver_profiles';

    public function get($id) { return $this->db->get_where($this->table, array('id' => $id))->row(); }

    public function get_by_user($user_id) { return $this->db->get_where($this->table, array('user_id' => $user_id))->row(); }

    public function create($data) { $data['created_at'] = date('Y-m-d H:i:s'); $this->db->insert($this->table, $data); return $this->db->insert_id(); }

    public function update($id, $data) { $data['updated_at'] = date('Y-m-d H:i:s'); return $this->db->where('id', $id)->update($this->table, $data); }

    public function update_location($id, $lat, $lng) {
        return $this->update($id, array('current_lat' => $lat, 'current_lng' => $lng, 'last_location_update' => date('Y-m-d H:i:s')));
    }

    public function set_availability($id, $available) {
        return $this->update($id, array('is_available' => $available, 'is_online' => $available));
    }

    public function get_zones($driver_id) { return $this->db->where('driver_id', $driver_id)->where('is_active', 1)->get('driver_zones')->result(); }

    public function add_zone($driver_id, $zone_name) { $this->db->insert('driver_zones', array('driver_id' => $driver_id, 'zone_name' => $zone_name)); return $this->db->insert_id(); }

    public function remove_zone($id, $driver_id) { return $this->db->where('id', $id)->where('driver_id', $driver_id)->delete('driver_zones'); }

    public function stats($driver_id, $period = 'month') {
        $this->db->select('COUNT(*) as total_deliveries, SUM(driver_earning) as total_earned, AVG(driver_earning) as avg_earning')
            ->from('deliveries')->where('driver_id', $driver_id)->where('status', 'delivered');
        switch ($period) {
            case 'today': $this->db->where('DATE(delivered_at)', date('Y-m-d')); break;
            case 'week':  $this->db->where('delivered_at >=', date('Y-m-d', strtotime('-7 days'))); break;
            case 'month': $this->db->where('delivered_at >=', date('Y-m-01')); break;
        }
        return $this->db->get()->row();
    }
}
