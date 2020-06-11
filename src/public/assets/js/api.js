app.api = {
    // Envoie le score au serveur pour qu'il soit sauvegardé
    saveScore: (time) => {
        $.post('/score', {time}, () => {
            //Mise à jour des meilleurs scores après le nouvel ajout
            app.api.getBestScores();
        });
    },
    // Appele le serveur pour obtenir la liste des meilleurs scores
    getBestScores: () => {
        $.get('/scores', (scores) => {
            scores = app.api.formatScores(scores);

            $(document).trigger('api:done', {scores});
        });
    },

    // Formate les scores (le serveur les envoie sous forme de chaines)
    formatScores: (scores) => {
        const numbers = [];

        $.each(scores, (key, score) => {
            numbers.push(parseInt(score));
        });

        return numbers;
    }
};