<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Flash_sale_model extends CI_Model
{
    public function get_active() {
        $now = date('Y-m-d H:i:s');
        return $this->db->select('fs.*, a.name, a.image, a.price as original_price, e.name as establishment_name')
            ->from('flash_sales fs')
            ->join('articles a', 'a.id = fs.article_id')
            ->join('establishments e', 'e.id = a.establishment_id')
            ->where('fs.is_active', 1)
            ->where('fs.starts_at <=', $now)
            ->where('fs.ends_at >=', $now)
            ->order_by('fs.ends_at', 'ASC')->get()->result();
    }
}
