<?php

namespace App\Controller;

use App\Entity\Score;
use App\Repository\ScoreRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;

class ScoreController extends AbstractController
{
    /**
     * Renvoie la liste des dix meilleurs scores en json
     * 
     * @Route("/scores", name="scores")
     * @Template
     */
    public function index(ScoreRepository $repository)
    {
        // On récupère les dix meilleurs scores via le repository Doctrine
        $scores = $repository->getTopTen();

        // Puis on renvoie les scores en JSON afin qu'ils puissent être utilisables en javascript
        // (La méthode $this->json est héritée de AbstractController)
        return $this->json($scores);
    }

    /**
     * Ajout d'un nouveau score
     * 
     * @Route("/score", name="score")
     * @Template
     */
    public function newScore(EntityManagerInterface $entityManager, Request $request)
    {
        // On récupère le temps effectué dans la requête HTTP
        $time = (int) $request->get('time');
        
        // On initialise  et hydrate l'objet score (doctrine étant un ORM il n'accepte que des objets)
        $score = new Score();
        $score->setTime($time);

        // Puis on le persiste en base données via l'EntityManger de doctrine
        $entityManager->persist($score);
        // La méthode flush équivaut à un 'COMMIT' de transaction en SQL, on valide définitivement les écritures en base
        $entityManager->flush();

        return $this->json('ok');
    }
}
