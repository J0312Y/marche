<?php
/**
 * LAMUKA MARKET API — CodeIgniter 3
 * Entry Point
 */
define('ENVIRONMENT', isset($_SERVER['CI_ENV']) ? $_SERVER['CI_ENV'] : 'development');

switch (ENVIRONMENT) {
    case 'development':
        error_reporting(-1);
        ini_set('display_errors', 1);
        break;
    case 'testing':
    case 'production':
        ini_set('display_errors', 0);
        error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT);
        break;
}

$system_path = 'system';
$application_folder = 'application';

define('SELF', pathinfo(__FILE__, PATHINFO_BASENAME));
define('BASEPATH', $system_path . '/');
define('FCPATH', dirname(__FILE__) . '/');
define('SYSDIR', basename(BASEPATH));
define('APPPATH', $application_folder . '/');
define('VIEWPATH', APPPATH . 'views/');

require_once BASEPATH . 'core/CodeIgniter.php';
