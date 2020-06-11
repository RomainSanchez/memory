// Compteur de temps
app.timer = {
    interval: undefined,
    count: undefined,
    countFrom: 240, // seconds

    //Lancement et redémarrage du timer
    start: () => {
      if (app.timer.interval) {
        clearInterval(app.timer.interval);
      }

      app.timer.count = app.timer.countFrom;

      app.timer.count = app.timer.countFrom;
      app.timer.interval = setInterval((app.timer.tick).bind(app.timer), 1000);
    },

    // Arret du timer
    stop: () => {        
      clearInterval(app.timer.interval);       
    },

    // Temps restant
    getTime: () => {
        return app.timer.count;
    },

    // Décrémentation du compteur
    tick: () => {
      app.timer.count -= 1;

      if (app.timer.count <= 0) {
        app.timer.count = 0;

        clearInterval(app.timer.interval);

        $(document).trigger('timer:done');
       }

       $(document).trigger('timer:tick', app.timer.count);
    }
};