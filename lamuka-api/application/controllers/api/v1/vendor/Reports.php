<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reports extends Vendor_Controller
{
    public function __construct() { parent::__construct(); $this->load->model('Order_model'); }
    public function index() {
        if (!$this->_require_establishment()) return;
        $eid = $this->establishment->id;
        $period = $this->input->get('period') ?: 'month';

        $revenue = $this->Order_model->revenue_by_establishment($eid, $period);
        $total_orders = $this->Order_model->count_by_establishment($eid);

        // Top articles
        $top = $this->db->select('a.name, SUM(oi.quantity) as sold, SUM(oi.subtotal) as revenue')
            ->from('order_items oi')
            ->join('orders o', 'o.id = oi.order_id AND o.payment_status = "paid"')
            ->join('articles a', 'a.id = oi.article_id')
            ->where('o.establishment_id', $eid)
            ->group_by('oi.article_id')
            ->order_by('sold', 'DESC')
            ->limit(10)->get()->result();

        json_success(array('revenue' => $revenue, 'total_orders' => $total_orders, 'top_articles' => $top, 'period' => $period));
    }
}
