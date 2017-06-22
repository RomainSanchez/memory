app.register({
    baseUi: {
        initEvents: function() {
            $(document)

                .on('templates.registered', function() {
                    app.core.ui.applyTemplate('navbar');
                })

                .on('app.ready', function() {
                    app.ctrl.homeAction();
                })
        },
        registerTemplates: function() {
            app.core.ui.addTemplate('app', 'navbar', app.config.liftJsPath+'js/modules/baseUi/views/navbar.html');
            app.core.ui.addTemplate('content', 'settings', app.config.liftJsPath+'js/modules/baseUi/views/settings.html');
        },

        openModal: function(templateName, data, options) {
            var defaults = {
                dismissible: true,
                opacity: .5,
                inDuration: 300,
                outDuration: 200,
                startingTop: '4%',
                endingTop: '10%',
            };

            $.extend({}, defaults, options);

            var open = function() {
              var modal = $('.modal');

              modal.modal();

              if(!modal.hasClass('open')) {
                  modal.modal('open');
              }
            }

            if($('.modal').length == 0) {
                app.core.ctrl.render(templateName, data, false).then(open);
            } else {
                open();
            }
        },

        closeModal: function() {
            var modal = $('.modal');

            if(modal.hasClass('open')) {
                modal.modal('close');
                $('.modal').remove();
            }
        },
    }
});
