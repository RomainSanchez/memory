app.register({
    core: {
        routing: {
            getCurrentUri: function() {
                var uri = window.location.pathname;
                if (app.config.appUriPrefix.match(/^\?/)) {
                    var uri = window.location.search;
                } else if (app.config.appUriPrefix.match(/^\#/)) {
                    var uri = window.location.hash;
                }
                return uri;
            },

            findState: function(uri) {
                var foundState = null;

                $.each(app.ctrl.states, function(i, state) {
                    if (app.config.appUriPrefix + state.path === uri) {
                        foundState = state;
                        foundState.action = i + 'Action';
                    }
                });

                return foundState;
            },

            initEvents: function() {

                $(document)

                    .on('app.ready', function() {
                        var currentUri = app.core.routing.getCurrentUri();
                        var state = app.core.routing.findState(currentUri);


                        if (state) {
                            var callable = app.ctrl[state.action];
                            callable();
                        }
                    });
            }
        }
    }
});
