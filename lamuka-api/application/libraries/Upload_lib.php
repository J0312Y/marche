<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Upload_lib — Gestion des uploads d'images
 * Lamuka Market
 */
class Upload_lib
{
    private $CI;
    private $base_path;
    private $base_url;

    public function __construct()
    {
        $this->CI =& get_instance();
        $this->base_path = FCPATH . 'uploads/';
        $this->base_url  = $this->CI->config->item('base_url') . 'uploads/';
    }

    /**
     * Upload une image
     *
     * @param string $field     Nom du champ file input
     * @param string $folder    Sous-dossier (avatars, articles, documents)
     * @param int    $max_size  Taille max en KB (défaut 5MB)
     * @return array ['success' => bool, 'path' => string, 'url' => string]
     */
    public function upload_image($field, $folder = 'articles', $max_size = 5120)
    {
        $upload_path = $this->base_path . $folder . '/';

        if (!is_dir($upload_path)) {
            mkdir($upload_path, 0755, true);
        }

        // Nom unique
        $filename = uniqid($folder . '_') . '_' . time();

        $config = array(
            'upload_path'   => $upload_path,
            'allowed_types' => 'jpg|jpeg|png|webp|gif',
            'max_size'      => $max_size,
            'max_width'     => 4096,
            'max_height'    => 4096,
            'file_name'     => $filename,
            'encrypt_name'  => false,
        );

        $this->CI->load->library('upload', $config);

        if (!$this->CI->upload->do_upload($field)) {
            return array(
                'success' => false,
                'message' => $this->CI->upload->display_errors('', ''),
            );
        }

        $data = $this->CI->upload->data();

        return array(
            'success'  => true,
            'path'     => $folder . '/' . $data['file_name'],
            'url'      => $this->base_url . $folder . '/' . $data['file_name'],
            'filename' => $data['file_name'],
            'size'     => $data['file_size'],
            'width'    => $data['image_width'],
            'height'   => $data['image_height'],
        );
    }

    /**
     * Upload depuis base64
     */
    public function upload_base64($base64_string, $folder = 'articles')
    {
        $upload_path = $this->base_path . $folder . '/';

        if (!is_dir($upload_path)) {
            mkdir($upload_path, 0755, true);
        }

        // Extraire les données
        if (preg_match('/^data:image\/(\w+);base64,/', $base64_string, $matches)) {
            $ext = $matches[1];
            $data = substr($base64_string, strpos($base64_string, ',') + 1);
        } else {
            $ext = 'jpg';
            $data = $base64_string;
        }

        $data = base64_decode($data);
        if ($data === false) {
            return array('success' => false, 'message' => 'Données base64 invalides');
        }

        $filename = uniqid($folder . '_') . '_' . time() . '.' . $ext;
        $filepath = $upload_path . $filename;

        if (file_put_contents($filepath, $data)) {
            return array(
                'success'  => true,
                'path'     => $folder . '/' . $filename,
                'url'      => $this->base_url . $folder . '/' . $filename,
                'filename' => $filename,
            );
        }

        return array('success' => false, 'message' => 'Erreur d\'écriture du fichier');
    }

    /**
     * Supprimer une image
     */
    public function delete($path)
    {
        $filepath = $this->base_path . $path;
        if (file_exists($filepath)) {
            return unlink($filepath);
        }
        return false;
    }

    /**
     * URL complète d'une image
     */
    public function url($path)
    {
        if (empty($path)) return null;
        if (strpos($path, 'http') === 0) return $path;
        return $this->base_url . $path;
    }
}
