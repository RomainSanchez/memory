app.utils = {
    // Dédoublement des cartes pour pouvoir faire des paires
    createPairs: () => {
        let pairs = [];

        $.each(app.cards, (key, card) => {
            pairs.push(card);
            pairs.push(card);
        });

        return pairs;
    },

    // Mélange aléatoire des cartes
    shufflePairs: (pairs) => {
        // pairs.sort(() => {
        //     return 0.5 - Math.random() 
        // });
    }
};