app.register({
    core: {
        ui: {

            // HANDLE APPLICATION TEMPLATES
            templates: {},

            init: function () {
                $(document).trigger('ui.init');
            },

            // -------------------------------------------------------------------------
            // UI GLOBAL EVENTS
            // -------------------------------------------------------------------------

            initEvents: function () {

            },

            // -------------------------------------------------------------------------
            // UI PLUGINS (THIRD PARTY JS PLUGINS)
            // -------------------------------------------------------------------------

            plugins: {
                init: function () {
                    moment.locale('fr');
                    app.core.ui.setApplicationName();
                    app.core.ui.plugins.initTabs();
                    app.core.ui.plugins.initTooltips();
                    app.core.ui.plugins.initDropDown();
                    app.core.ui.plugins.registerComponentPlugins(app);
                },

                // ---------------------------------------------------------------------
                // MATERIALIZECSS TABS
                // ---------------------------------------------------------------------

                initTabs: function () {
                    $('ul#tabs').tabs();
                    var tabsId = $('div.tab-content:first-of-type').attr('id');
                    $('ul#tabs').tabs('select_tab', tabsId);
                },

                // ---------------------------------------------------------------------
                // MATERIALIZECSS TOOLTIPS
                // ---------------------------------------------------------------------

                initTooltips: function () {
                    $('.material-tooltip').remove();
                    $('*[data-tooltip]').tooltip({
                        delay: 50
                    });
                },

                // ---------------------------------------------------------------------
                // MATERIALIZECSS DROPDOWN
                // ---------------------------------------------------------------------

                initDropDown: function () {
                    $('.dropdown-button').dropdown();
                },

                // ---------------------------------------------------------------------
                // INITIALIZE COMPONENTS PLUGINS
                // ---------------------------------------------------------------------

                registerComponentPlugins: function (component, deep) {
                    if (!isDefined(deep))
                        deep = 0;

                    if (deep > 3) // LIMIT INIT SEARCH RECURSION TO 4 LEVEL
                        return;

                    // RECURSION OVER APPLICATION COMPONENTS
                    Object.keys(component).forEach(function (key) {
                        var c = component[key];
                        if (c && c.hasOwnProperty('initPlugins')) {
                            c.initPlugins();
                        } else if (typeof c === "object") {
                            app.core.ui.plugins.registerComponentPlugins(c, ++deep);
                        }
                    });
                }
            },

            // -------------------------------------------------------------------------
            // SETS APP NAME IN NAVBAR AND PAGE TITLE
            // -------------------------------------------------------------------------

            setApplicationName: function () {
                var appName = app.config.applicationName;

                document.title = appName;
                $('nav .brand-logo').html(appName);
            },

            // -------------------------------------------------------------------------
            // LOOP LOADING HANDLEBARS TEMPLATES
            // -------------------------------------------------------------------------

            initTemplates: function () {
                var promises = [];

                // FETCH TEMPLATES

                $('handlebars-template').each(function () {
                    var defer = $.Deferred();
                    var tpl = $(this);
                    var id = tpl.attr('name');
                    var src = tpl.attr('src');

                    promises.push(defer.promise());

                    if (isDefined(src)) {
                        $.ajax({
                            async: true,
                            url: src,
                            success: function (data) {

                                // REGISTER TEMPLATE

                                app.core.ui.templates[id] = {
                                    id: id,
                                    data: data,
                                    element: tpl
                                };

                                $(document).trigger('template.registered', [app.core.ui.templates[id]]);

                                defer.resolve();
                            }
                        });
                    } else {
                        // REGISTER TEMPLATE

                        app.core.ui.templates[id] = {
                            id: id,
                            data: tpl.html(),
                            element: tpl
                        };

                        $(document).trigger('template.registered', [app.core.ui.templates[id]]);

                        defer.resolve();
                    }
                });

                $.when.apply($, promises).then(function () {
                    $(document).trigger('templates.registered');
                }, function (e) {
                    $(document).trigger('app.failed');
                });
            },

            // -------------------------------------------------------------------------
            // APPLY COMPILED TEMPLATE
            // -------------------------------------------------------------------------

            applyTemplate: function (name, tpl) {
                if (!isDefined(tpl) && app.core.ui.templates.hasOwnProperty(name))
                    tpl = app.core.ui.templates[name].data;
                $('handlebars-template[name="' + name + '"]').html(tpl);
                $(document).trigger('template.applied', [name]);
            },

            // -------------------------------------------------------------------------
            // CLEAR .CONTENT PLACEHOLDERS
            // -------------------------------------------------------------------------

            clearContent: function () {
                $('#app div.content handlebars-template').html('');
            },

            // -------------------------------------------------------------------------
            // SHOW BIG LOADER IN CONTENT
            // -------------------------------------------------------------------------

            displayContentLoading: function (show) {
                if (!isDefined(show))
                    show = true;
                var loader = $('#contentLoader');

                if (show === true)
                    loader.show();
                else
                    loader.hide();
            },

            // -------------------------------------------------------------------------
            // SHOW TOAST (FLASH MESSAGE)
            // -------------------------------------------------------------------------

            toast: function (message, type, delay) {
                if (!isDefined(delay))
                    delay = 5000;
                if (!isDefined(type))
                    type = 'default';

                switch (type) {
                    case 'info':
                        icon = '<i class="material-icons right">info</i>';
                        break;
                    case 'warning':
                        icon = '<i class="material-icons right">warning</i>';
                        break;
                    case 'error':
                        icon = '<i class="material-icons right">error</i>';
                        break;
                    case 'success':
                        icon = '<i class="material-icons right">check_circle</i>';
                        break;
                    default:
                        icon = '<i class="material-icons right">notifications</i>';
                        break;
                }

                Materialize.toast(message + icon, delay, type);
            }
        }
    }
});
