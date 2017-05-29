<?php

class App
{
    public function getParameters()
    {
        $params = json_decode(file_get_contents('./data/parameters.json'));
        $params->appHostname = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['SERVER_NAME'];
        return $params;
    }

    public function getParametersAction()
    {
        header('Content-Type: application/json');
        $params = $this->getParameters();
        echo json_encode($params, JSON_FORCE_OBJECT);
        die();
    }

}
