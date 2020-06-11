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
        app.ui.clickEvents();

        $(document)
            .on('timer:tick', (event, time) => {
                app.ui.updateTime(time)
            })
            .on('timer:done', () => {
                app.gameOver(false);
            });

        ;
    },

    // Lancement d'une partie
    startGame: () => {
        console.log(app)
        // Récupération du jeu de cartes mélangé
        app.set = app.cards.getShuffledSet();

        // Initialisation du jeu de carte dans l'interface
        app.ui.initBoard();

        app.timer.start();

      
        // Lancement du timer de la partie
        setTimeout(() => {
        //     endGame();
        }, 50000);
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
        if (!valid) {
            app.ui.flipCard(app.firstCard);
            app.ui.flipCard(app.secondCard);
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
            alert(time);

            return;
        }


        // persist time
        alert(`${app.score} / ${app.total}`);

        app.score = 0
    },
};

// Lancement de l'application
$(document).ready(app.init);