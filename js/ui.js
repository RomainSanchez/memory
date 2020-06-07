// Manipulations de l'interface utilisateur
app.ui = {
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

    //Ajout d'une carte au tableau de jeu
    addCard: (key, card) => {
        // Création des images
        let cover = $('<img>')
            .attr('src', 'img/cover.jpg')
            .addClass('card-cover')
        ;
        let img = $('<img>')
            .attr('src', `img/${card.image}`)
            .addClass('card-image')
        ;
        // Création de la carte HTML
        let htmlCard = $('<div>')
            .addClass('card')
            .addClass('hidden')
            .prop('id', card.name)
            .append(cover)
            .append(img)
        ;
        // Insertion de la carte dans le tableau de jeu
        $('#board').append(htmlCard);
    },

    // Désactive les événements de click sur la paire validée
    disableSelection: () => {
        $.each([app.firstCard, app.secondCard], (card) => {
            $(`#${card.name}`)
                .css('border', '5px solid green')
                .off('click')
            ;
        });
    },
};