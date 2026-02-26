<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Geolocation_lib — Calcul de distances et zones
 * Lamuka Market
 */
class Geolocation_lib
{
    private $CI;

    public function __construct()
    {
        $this->CI =& get_instance();
    }

    /**
     * Calculer la distance entre 2 points GPS (en km)
     * Formule Haversine
     */
    public function distance($lat1, $lng1, $lat2, $lng2)
    {
        $R = 6371; // Rayon de la Terre en km

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2)
           + cos(deg2rad($lat1)) * cos(deg2rad($lat2))
           * sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($R * $c, 2);
    }

    /**
     * Calculer les frais de livraison en FCFA
     */
    public function calculate_delivery_fee($lat1, $lng1, $lat2, $lng2)
    {
        $distance = $this->distance($lat1, $lng1, $lat2, $lng2);

        // Chercher la zone de livraison
        $base_fee   = (int) $this->CI->db->select('value')->from('settings')
                        ->where('key', 'delivery_base_fee')->get()->row()->value;
        $per_km_fee = (int) $this->CI->db->select('value')->from('settings')
                        ->where('key', 'delivery_per_km')->get()->row()->value;

        $fee = $base_fee + ($distance * $per_km_fee);

        // Arrondir au 500 FCFA supérieur
        $fee = ceil($fee / 500) * 500;

        return array(
            'distance_km'  => $distance,
            'fee'          => (int) $fee,
            'base_fee'     => $base_fee,
            'per_km_fee'   => $per_km_fee,
        );
    }

    /**
     * Trouver les établissements proches
     *
     * @param float $lat      Latitude centre
     * @param float $lng      Longitude centre
     * @param int   $radius   Rayon en km (défaut 10)
     * @return CI_DB_query_builder  Query builder avec distance calculée
     */
    public function nearby_query($lat, $lng, $radius = 10)
    {
        // Formule Haversine en SQL
        $haversine = "(6371 * acos(cos(radians({$lat})) * cos(radians(latitude)) 
                      * cos(radians(longitude) - radians({$lng})) 
                      + sin(radians({$lat})) * sin(radians(latitude))))";

        $this->CI->db->select("*, {$haversine} AS distance", false)
                     ->having('distance <=', $radius)
                     ->order_by('distance', 'ASC');

        return $this->CI->db;
    }

    /**
     * Trouver les livreurs disponibles proches
     */
    public function nearby_drivers($lat, $lng, $radius = 5, $limit = 10)
    {
        $haversine = "(6371 * acos(cos(radians({$lat})) * cos(radians(current_lat)) 
                      * cos(radians(current_lng) - radians({$lng})) 
                      + sin(radians({$lat})) * sin(radians(current_lat))))";

        return $this->CI->db
            ->select("dp.*, u.first_name, u.last_name, u.phone, u.avatar, {$haversine} AS distance", false)
            ->from('driver_profiles dp')
            ->join('users u', 'u.id = dp.user_id')
            ->where('dp.is_available', 1)
            ->where('dp.is_online', 1)
            ->where('dp.status', 'active')
            ->where('dp.current_lat IS NOT NULL')
            ->having('distance <=', $radius)
            ->order_by('distance', 'ASC')
            ->limit($limit)
            ->get()
            ->result();
    }
}
