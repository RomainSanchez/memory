app.register({
    baseUi: {
        registerTemplates: function() {
            app.core.ui.addTemplate('app', 'navbar', 'js/modules/baseUi/views/navbar.html');
            app.core.ui.addTemplate('content', 'settings', 'js/modules/baseUi/views/settings.html');
        },

        openModal: function(templateName, data) {
            app.core.ctrl.render(templateName, data, false).then(function() {
                $('.modal')
                    .modal({
                        dismissible: true,
                        opacity: .5,
                        inDuration: 300,
                        outDuration: 200,
                        startingTop: '4%',
                        endingTop: '10%',
                    })
                    .modal('open');
            });
        },

        closeModal: function() {
            $('.modal').modal('close');
        },
    }
});