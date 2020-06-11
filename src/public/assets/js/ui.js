// Manipulations de l'interface utilisateur
app.ui = {
    // Evénements de click
    events: () => {
        /* On attache les listeners directement au document
         afin qu'il ne fonctionnent pas uniquement pour les éléments déjà présents dans le dom
         */
        $(document)
            // Click du bouton "Démarrer"
            .on('click', '.start-button', app.startGame)
            // Click sur une carte
            .on('click', '.card', app.handleSelection)
        ;
    },

    // Initialisation du tableau de jeux
    initBoard: () => {
        // Réinitialisation si ce n'est pas la première partie
        $('.board').empty();
        
        // Insertion des cartes HTML dans le DOM
        $.each(app.set, app.ui.addCard);
        
    },

    // Ajout d'une carte au tableau de jeu
    addCard: (key, card) => {
        // Création des images
        let cover = $('<img>')
            .attr('src', 'assets/img/cover.jpg')
            .addClass('card-cover')
        ;
        let img = $('<img>')
            .attr('src', `assets/img/${card.image}`)
            .addClass('card-image')
        ;
        // Création de la carte HTML
        let htmlCard = $('<li>')
            .addClass('card')
            .addClass('hidden')
            .prop('id', card.name)
            .append(cover)
            .append(img)
        ;
        // Insertion de la carte dans le tableau de jeu
        $('.board').append(htmlCard);
    },

    // Retournement d'une carte
    flipCard: (card) => {
        // Récupération de l'élément html correspondant à la carte dans le DOM
        card = $(`#${card.name}`);
        // Récupération des images
        let cover = card.find('.card-cover');
        let image = card.find('.card-image');

        // Returnement de la carte en fonction de son état actuel
        if(card.hasClass('hidden')) {
            cover.hide();
            image.show();
            card.removeClass('hidden');

            return;
        }

        cover.show();
        image.hide();
        card.addClass('hidden');
    },

    // Désactive la paire validée
    disablePair: () => {
        $.each([app.firstCard, app.secondCard], (key, card) => {
            $(`#${card.name}`)
                .css('border', '5px solid green')
                .off('click')
            ;
        });
    },

    // Mise à jour du score à l'écran
    updateScore: (score) => {
        $('.score span').html(score);

        if(score == 1) {
            $('.score').show();
        }
    },

    // Mise à jour du temps restant
    updateTime: (time) => {
        $('.timer span').html(app.ui.secondsToTime(time));
    },

    // Affichage des meilleurs scores
    displayScores: (scores) => {
        const list = $('.scores');
        
        list.empty();

        $.each(scores, (key, score) => {
            const ellapsedTime = app.timer.countFrom - score;

            const htmlScore = $('<li>')
                .addClass('high-score')
                .html(app.ui.secondsToTime(ellapsedTime))
            ;

            list.append(htmlScore);
        });
    },

    // Convertit le score (temps restant) en minutes et secondes écoulées
    secondsToTime: (time) => {
        const minutes = Math.floor(time % 3600 / 60).toString().padStart(2,'0');
        
        const seconds = Math.floor(time % 60).toString().padStart(2,'0');

        return `${minutes}m ${seconds}s`;

    }
};