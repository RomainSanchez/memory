// Génération du jeu de cartes
app.cards = {
    // Liste des cartes existantes
    initialSet: [
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

    // Récupération du jeu de cartes complet mélangé aléatoirement
    getShuffledSet: () => {
        let pairs = app.cards.createPairs();

        app.cards.shuffle(pairs);
        
        return pairs;
    },
    // Dédoublement des cartes pour pouvoir faire des paires
    createPairs: () => {
        let pairs = [];

        $.each(app.cards.initialSet, (key, card) => {
            let clone = {
                name: `${card.name}2`,
                image: card.image
            };

            pairs.push(card);
            pairs.push(clone);
        });

        return pairs;
    },

    // Mélange aléatoire des cartes
    shuffle: (pairs) => {
        // pairs.sort(() => {
        //     return 0.5 - Math.random() 
        // });
    }
};