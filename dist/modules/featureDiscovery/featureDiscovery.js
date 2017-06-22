app.register({
    featureDiscovery: {

        registerTemplates: function() {

            app.core.ui.addTemplate('app', 'infos', 'js/modules/featureDiscovery/views/infos.html');
            app.core.ui.addTemplate('content', 'settings', 'js/modules/featureDiscovery/views/settings.html');

        },

        initEvents: function() {
            $(document)

                .on('template.registered', function(e, template) {
                    if (template.id === "infos") {
                        app.core.ui.applyTemplate(template.id, template.data);
                    }
                })

                .on('click', '.tap-target button.understood', function(e) {
                    var tap = $(this).closest('.tap-target');
                    app.featureDiscovery.hideFeatureDiscovery(tap.attr('id'), true);
                })

                .on('click', '.tap-target', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    if (!$(e.currentTarget).is('button')) {
                        $(e.currentTarget).tapTarget('close');
                    }
                })

                .on('ctrl.beforego, content.cleared', function() {
                    app.featureDiscovery.hideFeatureDiscovery();
                })
                .on('ctrl.aftergo, history.popedstate, ctrl.postrender', function() {
                    //app.featureDiscovery.showFeatureDiscovery();
                })

            ;


        },
        // -------------------------------------------------------------------------
        // SHOW FEATURE DISCOVERIES
        // -------------------------------------------------------------------------

        showFeatureDiscovery: function(id) {

            var elem = $('.tap-target');

            if (isDefined(id)) {
                elem = elem.filter('#' + id);
            }

            elem.each(function() {
                var id = $(this).attr('id');

                if (!app.featureDiscovery.__getInfosStorage().hasOwnProperty(id))
                    elem.tapTarget('open');
            });

        },

        // -------------------------------------------------------------------------
        // HIDE FEATURE DISCOVERIES
        // -------------------------------------------------------------------------

        hideFeatureDiscovery: function(id, dontshowagain) {
            var elem = null;
            if (!isDefined(id)) {
                elem = $('.tap-target');
            } else {
                elem = $('#' + id);
            }

            if (isDefined(dontshowagain) && dontshowagain) {
                app.featureDiscovery.__setInfosStorage(id);
            }

            elem.tapTarget('close');
        },

        // -------------------------------------------------------------------------
        // INTERNAL : MANAGE « DON'T SHOW AGAIN » FEATURE
        // -------------------------------------------------------------------------

        __getInfosStorage: function() {
            var infos = localStorage.getItem(app.config.clientSessionName + '_infos');

            if (infos === null)
                infos = '{}';

            return JSON.parse(infos);
        },
        __setInfosStorage: function(id) {
            var infos = app.featureDiscovery.__getInfosStorage();

            infos[id] = id;

            localStorage.setItem(app.config.clientSessionName + '_infos', JSON.stringify(infos));
        },
        __resetInfosStorage: function() {
            localStorage.setItem(app.config.clientSessionName + '_infos', '{}');
        }
    },
    ctrl: {
        updateSettings: function(data) {
            if (data.clearAllInfosMessages === true) {
                app.featureDiscovery.__resetInfosStorage();
            }
            app.core.ui.toast("Paramètres enregistrés", "success");
            app.ctrl.homeAction();
        }
    }
});
