/* global app */

app.register({
    core: {
        ws: {

            // ---------------------------------------------------------------------
            // RENEW AND CHECK API TOKEN
            // ---------------------------------------------------------------------

            apiAuth: function () {
                var defer = $.Deferred();

                // TEST IF TOKEN IN SESSION IS VALID
                if (app.core.session.tokenIsValid()) {
                    // TOKEN IS VALID, SKIPPING RE-AUTH
                    defer.resolve();
                    return defer.promise();
                }

                // TOKEN IS NOT VALID, RE-AUTH
                defer.resolve();

                return defer.promise();
            },

            // ---------------------------------------------------------------------
            // INTERNAL - CALL WRAPPER
            // ---------------------------------------------------------------------

            call: function (method, action, data, callback, errorCallback, ignoreApiBaseUri) {
                var defer = $.Deferred();

                var statusCode = {
                    0: function () {
                        defer.reject();
                        return defer.promise();
                    },
                    302: function (response, defer) {
                        if (app.config.debug) {
                            app.core.ui.toast('Appel non géré par l\'API', 'warning');
                        }
                        defer.reject();
                        return defer.promise();
                    },
                    400: function (response, defer) {
                        if (app.config.debug) {
                            app.core.ui.toast('Echec de la requêteé (' + response.responseJSON.code + '): ' + response.responseJSON.message, 'warning');
                        }

                        defer.reject();
                        return defer.promise();
                    },
                    401: function (response, defer) {
                        if (app.config.debug) {
                            app.core.ui.toast('Accès refusé (' + response.responseJSON.code + '): ' + response.responseJSON.message, 'warning');
                        }

                        if (response.responseJSON.message === "Invalid API authentication") {
                            // Need force re-auth
                            app.core.session.tokenExpirationDate = null;
                            app.core.session.save();
                            app.core.ws.apiAuth().always(function () {
                                defer.resolve();
                            });

                            return defer.promise();
                        } else {
                            defer.reject();
                            return defer.promise();
                        }

                    },
                    404: function (response, defer) {
                        if (app.config.debug) {
                            app.core.ui.toast('Page non trouvée pour l\'URL : ' + baseUrl + action, 'warning');
                        }
                        defer.reject();
                        return defer.promise();
                    },
                    500: function (response, defer) {
                        if (app.config.debug) {
                            app.core.ui.toast('Le serveur à rencontré une erreur', 'warning');
                        }
                        defer.reject();
                        return defer.promise();
                    }
                };

                app.core.ws.apiAuth()
                    .then(function () {
                        if (!isDefined(callback))
                            callback = function (res, textStatus, jqXHR) {};

                        if (!isDefined(errorCallback))
                            errorCallback = function (jqXHR, textStatus, errorThrown) {

                            };

                        if (!isDefined(method))
                            method = 'GET';

                        if (!isDefined(data))
                            data = {};

                        var baseUrl =
                            app.config.webservice.protocol +
                            "://" +
                            app.config.webservice.hostname +
                            (ignoreApiBaseUri ? '' : app.config.webservice.apiBaseUri);

                        if (method === "POST") {
                            data = JSON.stringify(data);
                        }

                        $.ajax({
                            url: baseUrl + action,
                            method: method,
                            data: data,
                            crossDomain: true,
                            success: function (response, textStatus, jqXHR) {

                                if (jqXHR.status === 204)
                                    response = "{}";

                                if (typeof response !== 'object')
                                    response = JSON.parse(response);

                                callback(response, textStatus, jqXHR);
                                defer.resolve();
                            },
                            beforeSend: function (xhr) {
                                if (app.core.session.hasOwnProperty('access_token') && app.core.session.access_token !== null) {
                                    xhr.setRequestHeader('Authorization', app.core.utils.ucfirst(app.core.session.token_type) + " " + app.core.session.access_token);
                                }
                                if (method === "POST")
                                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                errorCallback(jqXHR, textStatus, errorThrown);
                                statusCode[jqXHR.status](jqXHR, defer);
                            }
                        });
                    }, function () {
                        if (app.core.history.currentState.path !== app.ctrl.states.login.path)
                            app.ctrl.loginAction();
                    });

                return defer.promise();
            }
        },
        session: {
            tokenIsValid: function () {
                if (!app.core.session.tokenIsSet())
                    return false;

                var expireDate = app.core.utils.parseDate(app.core.session.tokenExpirationDate);

                if (isDefined(expireDate)) {
                    return expireDate > app.core.utils.parseDate();
                }
                return true;
            },
            tokenIsSet: function () {
                return (app.core.session.access_token !== null ? true : false);
            },
            updateTokenExpirationDate: function () {
                var tokenExpirationDate = app.core.utils.parseDate();
                tokenExpirationDate.setSeconds(tokenExpirationDate.getSeconds() + (parseInt(app.core.session.expires_in, 10)) - 60);

                app.core.session.tokenExpirationDate = tokenExpirationDate;
                app.core.session.save();
            }
        }
    }
});
