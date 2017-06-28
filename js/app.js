var app = {

    // APPLICATION CONFIG
    config: {},

    // APPLICATION CORE MODULES
    core: {},

    // APPLICATION READY STATE
    isReady: false,

    // -------------------------------------------------------------------------
    // INIT APPLICATION AT LOAD TIME
    // -------------------------------------------------------------------------

    init: function() {
        var host = null;

        // MANAGE INSTANCE HOST URL

        if (isDefined(app.config.host)) {
            host = app.config.host;
        } else {
            var protocol = location.protocol;
            var slashes = protocol.concat("//");
            host = slashes.concat(window.location.host);
        }

        // GET APP PARAMETERS
        $.get(host + (app.config.parametersPath ? app.config.parametersPath : '/data/parameters.json'), function(params) {
            app.config = params;
            app.core.utils.init();
            app.core.events.init();
            app.core.session.start();
        });

        // SESSION STARTED

        $(document).on('session.started', function() {
            app.core.ui.registerModulesTemplates();
            app.core.ui.initTemplates();
        });

        // ALL TEMPLATES LOADED

        $(document).on('templates.registered', function() {
            app.core.ui.plugins.init();
            app.core.ui.init();
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
    },

    // -------------------------------------------------------------------------
    // CHECK IF MODULE EXISTS
    // -------------------------------------------------------------------------

    moduleExists: function(modulePath) {
        return app.core.utils.deepFind(app,modulePath);
    }
};
