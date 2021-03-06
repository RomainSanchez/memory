// Déclaration de l'application
let app = {
    // Nombre de paires à valider
    total: 18,
    // Nombre de paires actuel
    score: 0,
    // Jeu de cartes
    set: [],
    // Cartes sélectionnées
    firstCard: undefined,
    secondCard: undefined,
    // Initialisation de l'application
    init: () => {
        app.events();
        app.ui.events();
        app.api.getBestScores();
    },

    // Attachment des listeners d'événements
    events: () => {
        $(document)
            .on('timer:tick', (event, time) => {
                app.ui.updateTime(time)
            })
            .on('timer:done', () => {
                app.gameOver(false);
            })
            .on('api:done', (event, data) => {
                app.ui.displayScores(data.scores);
            });

        ;
    },

    // Lancement d'une partie
    startGame: () => {
        app.ui.updateScore(0);
        
        // Récupération du jeu de cartes mélangé
        app.set = app.cards.getShuffledSet();

        // Initialisation du jeu de carte dans l'interface
        app.ui.initBoard();

        app.timer.start();
    }, 

    // Gestion de la sélection d'une carte
    handleSelection: (event) => {
        // Récupération du nom de la carte cliquée
        let cardName = $(event.currentTarget).attr('id');
        // Recherche de la carte dans le jeu de carte
        let card = app.set.find((element) => {
            return element.name == cardName;
        });

        if(app.firstCard === undefined) {
            app.ui.flipCard(card);
            app.firstCard = card;

            return;
        }

        if(app.secondCard === undefined) {
            app.ui.flipCard(card);
            app.secondCard = card;
            // Validation de la paire sélectionnée         
            app.checkSelection();

        }
    },
    // Compare les cartes sélectionnées
    checkSelection: () => {
        // On compare les images des cartes car les noms sont toujours différents
        if(app.firstCard.image === app.secondCard.image) {
            app.ui.disablePair();
            app.increaseScore();
            app.resetSelection(true);

            return;
        }
        
        app.resetSelection(false);
    },

    // Réinitialise la sélection
    resetSelection: (valid) => {
        const first = app.firstCard;
        const second = app.secondCard

        if (!valid) {
            // Laisser le temps au jouer de voir la deuxieme carte sélectionnée avant de retourner
            setTimeout(function(a, b) {
                app.ui.flipCard(first);
                app.ui.flipCard(second);
            }, 1000);
        }
        
        app.firstCard = undefined;
        app.secondCard = undefined;
    },

    // Augmente le score quand une paire est validée
    increaseScore: () => {
        app.score++;

        app.ui.updateScore(app.score);

        // Partie gagnante
        if(app.score == app.total) {
            app.gameOver(true);
        }
    },

    // Fin de partie
    gameOver: (success) => {
        if (success) {
            app.timer.stop();

            const time = app.timer.getTime();
            
            app.api.saveScore(time);
            
            alert(`Bravo vous avez gagné!`);

            return;
        }


        alert(`Perdu ! Vous avez trouvé ${app.score} paires sur  ${app.total}`);
    },
};

// Lancement de l'application
$(document).ready(app.init);
