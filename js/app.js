// Déclaration de l'application
let app = {
    // Nombre de paires à valider
    total: 18,
    // Nombre de paires actuel
    score: 0,
    // Cartes sélectionnées
    firstCard: undefined,
    secondCard: undefined,
    // Jeu de cartes
    cards: [
        { name: 'apple',         image: 'apple.png' },
        { name: 'apricot',       image: 'apricot.png' },
        { name: 'banana',        image: 'banana.png' },
        { name: 'cherry',        image: 'cherry.png' },
        { name: 'grape',         image: 'grape.png' },
        { name: 'green-apple',   image: 'green-apple.png' },
        { name: 'lemon',         image: 'lemon.png' },
        { name: 'lime',          image: 'lime.png' },
        { name: 'mango',         image: 'mango.png' },
        { name: 'peach',         image: 'peach.png' },
        { name: 'pear',          image: 'pear.png' },
        { name: 'plum',          image: 'plum.png' },
        { name: 'pomegranate',   image: 'pomegranate.png' },
        { name: 'raspberry',     image: 'raspberry.png' },
        { name: 'strawberry',    image: 'strawberry.png' },
        { name: 'tangerine',     image: 'tangerine.png' },
        { name: 'watermelon',    image: 'watermelon.png' },
        { name: 'yellow-cherry', image: 'yellow-cherry.png' },
    ],

    // Lancement d'une partie
    startGame: () => {
        app.initBoard();  
      
        // Lancement du timer de la partie
        setTimeout(() => {
        //     endGame();
        }, 50000);
    }, 
    // Initialisation du tableau de jeux
    initBoard: () => {
        // Réinitialisation si ce n'est pas la première partie
        $('#board').empty();
        
        let pairs = app.utils.createPairs();
        app.utils.shufflePairs(pairs);
        
        // Insertion des cartes HTML dans le DOM
        $.each(pairs, app.ui.addCard);
        
    },

    // Gestion de la sélection d'une carte
    handleSelection: (event) => {
        // Récupération du nom de la carte cliquée
        let cardName = $(event.currentTarget).attr('id');
        // Recherche de la carte dans le jeu de carte
        let card = app.cards.find((element) => {
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
            
            app.checkSelection();
        }
    },
    // Valide la paire sélectionnée
    checkSelection: () => {
        if(app.firstCard.name === app.secondCard.name) {
            app.increaseScore();
            app.ui.disableSelection();

            return;
        }

        app.resetSelection();
    },

    // Réinitialise la sélection
    resetSelection: () => {
        app.ui.flipCard(app.firstCard);
        app.firstCard === undefined;

        app.ui.flipCard(app.secondCard);
        app.secondCard === undefined;
    },

    // Augmente le score quand une paire est validée
    increaseScore: () => {
        app.score++;

        app.ui.updateScore();

        // Partie gagnante
        if(app.score == app.total) {
            app.endGame();
        }
    },

    // Fin de partie
    endGame: () => {
        alert('fini');

        app.score = 0;
    },
} 

// EVENEMENTS
$(document)
    // Click du bouton "Démarrer"
    .on('click', '#start-button', app.startGame)
    // Click sur une carte
    .on('click', '.card', app.handleSelection) 
;