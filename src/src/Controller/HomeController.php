<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="")
     * @Template
     */
    public function index()
    {
        // La méthode peut rester vide car symfony va automatiquement cherche le template 'index.html.twig'
    }
}
