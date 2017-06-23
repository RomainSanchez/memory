app.register({
    ctrl: {

        // ---------------------------------------------------------------------
        // STATES
        // ---------------------------------------------------------------------

        states: {
            home: {
                path: "/",
                title: app.config.applicationName
            }
        },

        // ---------------------------------------------------------------------
        // ACTIONS
        // ---------------------------------------------------------------------

        homeAction: function()  {
            app.core.ctrl.go('home',{}).then(function() {
                app.core.history.add(app.ctrl.states.home);
            });
        }

    },
    core: {
        ctrl: {

            // ---------------------------------------------------------------------
            // INTERNAL METHODS
            // ---------------------------------------------------------------------

            go: function (templateName, data) {
                $(document).trigger('ctrl.beforego');
                return app.core.ctrl.render(templateName, data, true);
            },

            render: function (templateName, data, clearContent) {
                var defer = $.Deferred();

                $(document).trigger('ctrl.prerender');

                if (!isDefined(data) || data === null)
                    data = {};
                if (!isDefined(clearContent))
                    clearContent = false;

                if (clearContent) {
                    app.core.ui.clearContent();
                    app.core.ui.displayContentLoading(true);
                }

                app.core.ui.applyTemplate(templateName, data);

                $('.dropdown-button').dropdown('close');

                $(document).trigger('ctrl.postrender');

                defer.resolve();

                return defer.promise();
            }
        }
    }
});
