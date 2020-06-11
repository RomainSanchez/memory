app.api = {
    // Envoie la score au serveur pour qu'il soit sauvegardé
    saveScore: (time) => {
        $.post('/score', {time}, (res) => {
            console.log(res);
        });
    },
    // Appele le serveur pour obtenir la liste des meilleurs scores
    getBestScores: () => {
        $.get('/scores', (res) => {
            console.log(res);
        });
    }
};