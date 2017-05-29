app.register({
    core: {
        session: {
            initEvents: function () {
                
            },

            start: function () {
                var currentSession = app.core.sessionStorage.get(app.config.clientSessionName);

                if (currentSession === null) {
                    app.core.session.save();
                } else {
                    app.core.session.reload();
                }
                $(document).trigger('session.started');
            },

            save: function () {
                if (app.core.sessionStorage.engine === null)
                    app.core.session.start();
                app.core.sessionStorage.set(app.config.clientSessionName, JSON.stringify(app.core.session));
            },

            destroy: function () {
                app.core.sessionStorage.set(app.config.clientSessionName, JSON.stringify({}));
            },

            reload: function () {

                if (app.core.sessionStorage.engine === null)
                    app.core.session.start();

                var currentSession = app.core.sessionStorage.get(app.config.clientSessionName);

                if (currentSession !== null) {
                    currentSession = JSON.parse(currentSession);
                }

                $.extend(app.core.session, currentSession);
            }
        },
        sessionStorage: {
            engine: sessionStorage,
            get: function (key) {
                return app.core.sessionStorage.engine.getItem(key);
            },
            set: function (key, val) {
                var r = app.core.sessionStorage.engine.setItem(key, val);
                app.core.session.reload();
                return r;
            },
            remove: function (key) {
                return app.core.sessionStorage.engine.removeItem(key);
            }
        }
    }
});
