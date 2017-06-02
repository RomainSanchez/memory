app.register({
    baseUi: {
        registerTemplates: function() {

            app.core.ui.addTemplate('app', 'navbar', 'js/modules/baseUi/views/navbar.html');
            app.core.ui.addTemplate('app', 'modal', 'js/modules/baseUi/views/modal.html');
            app.core.ui.addTemplate('content', 'settings', 'js/modules/baseUi/views/settings.html');

        },
    }
});
