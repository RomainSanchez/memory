app.register({
    core: {
        settings: {

        }
    },

    ctrl: {
        states: {
            settings: {
                path: "/settings",
                title: "Paramètres"
            }
        },

        settingsAction: function () {
            app.core.history.currentCallable = app.ctrl.showSettings;
            app.core.ctrl.go('settings').then(function () {
                try {
                    Materialize.updateTextFields();
                } catch(e) {

                }
                app.core.history.add(app.ctrl.states.settings);
            });
        },

        updateSettings: function (data) {
            app.core.ui.toast("Paramètres enregistrés", "success");
            app.ctrl.homeAction();
        }
    }
});
