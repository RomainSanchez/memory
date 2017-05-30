var app = {

    // APPLICATION CONFIG
    config: {},

    // APPLICATION CORE MODULES
    core: {},

    // -------------------------------------------------------------------------
    // INIT APPLICATION AT LOAD TIME
    // -------------------------------------------------------------------------

    init: function() {

        app.core.ui.displayContentLoading(true);

        var host = null;

        if (isDefined(app.config.host)) {
            host = app.config.host;
        } else {
            var protocol = location.protocol;
            var slashes = protocol.concat("//");
            host = slashes.concat(window.location.hostname);
        }

        // GET APP PARAMETERS

        $.get(host + '/data/parameters.json', function(params) {
            app.config = params;
            app.core.utils.init();
            app.core.events.init();
            app.core.session.start();
        });

        // SESSION STARTED

        $(document).on('session.started', function() {
            app.core.ui.initTemplates();
        });

        // ALL TEMPLATES LOADED

        $(document).on('templates.registered', function() {
            app.core.ui.applyTemplate('navbar');
            app.core.ui.plugins.init();
            app.core.ui.init();
            app.core.ui.displayContentLoading(false);
            app.ctrl.homeAction();

            app.ready();
        });
    },

    ready: function() {
        $(document).trigger('app.ready');
    },

    // -------------------------------------------------------------------------
    // REGISTER APPLICATION MODULE
    // -------------------------------------------------------------------------

    register: function(component) {
        $.extend(true, app, component);
        return app;
    }
};