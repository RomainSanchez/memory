app.register({
    core: {
        ui: {

            // HANDLE APPLICATION TEMPLATES
            templates: {},

            init: function() {
                $(document).trigger('ui.init');
            },

            // -------------------------------------------------------------------------
            // UI GLOBAL EVENTS
            // -------------------------------------------------------------------------

            initEvents: function() {

            },

            // -------------------------------------------------------------------------
            // UI PLUGINS (THIRD PARTY JS PLUGINS)
            // -------------------------------------------------------------------------

            plugins: {
                init: function() {
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

                initTabs: function() {
                    $('ul#tabs').tabs();
                    var tabsId = $('div.tab-content:first-of-type').attr('id');
                    $('ul#tabs').tabs('select_tab', tabsId);
                },

                // ---------------------------------------------------------------------
                // MATERIALIZECSS TOOLTIPS
                // ---------------------------------------------------------------------

                initTooltips: function() {
                    $('.material-tooltip').remove();
                    $('*[data-tooltip]').tooltip({
                        delay: 50
                    });
                },

                // ---------------------------------------------------------------------
                // MATERIALIZECSS DROPDOWN
                // ---------------------------------------------------------------------

                initDropDown: function() {
                    $('.dropdown-button').dropdown();
                },

                // ---------------------------------------------------------------------
                // INITIALIZE COMPONENTS PLUGINS
                // ---------------------------------------------------------------------

                registerComponentPlugins: function(component, depth) {
                    if (!isDefined(depth))
                        depth = 0;

                    if (depth > 3) // LIMIT INIT SEARCH RECURSION TO 4 LEVEL
                        return;

                    // RECURSION OVER APPLICATION COMPONENTS
                    if (typeof component === Object) {
                        Object.keys(component).forEach(function(key) {
                            var c = component[key];
                            if (c && c.hasOwnProperty('initPlugins')) {
                                c.initPlugins();
                            } else if (typeof c === "object") {
                                app.core.ui.plugins.registerComponentPlugins(c, depth + 1);
                            }
                        });
                    }
                }
            },

            // -------------------------------------------------------------------------
            // SETS APP NAME IN NAVBAR AND PAGE TITLE
            // -------------------------------------------------------------------------

            setApplicationName: function() {
                var appName = app.config.applicationName;

                document.title = appName;
                $('nav .brand-logo').html(appName);
            },

            // -------------------------------------------------------------------------
            // CALL MODULES SELF TEMPLATES REGISTER
            // -------------------------------------------------------------------------

            registerModulesTemplates: function(component, depth) {
                if (!isDefined(component))
                    component = app;

                if (!isDefined(depth))
                    depth = 0;

                if (depth > 3) // LIMIT INIT SEARCH RECURSION TO 4 LEVEL
                    return;

                // RECURSION OVER APPLICATION COMPONENTS
                Object.keys(component).forEach(function(key) {
                    var c = component[key];
                    if (c && c.hasOwnProperty('registerTemplates')) {
                        c.registerTemplates();
                    } else if (c && typeof c === "object") {
                        app.core.ui.registerModulesTemplates(c, depth + 1);
                    }
                });
            },

            // -------------------------------------------------------------------------
            // LOOP LOADING HANDLEBARS TEMPLATES
            // -------------------------------------------------------------------------

            initTemplates: function() {
                var promises = [];

                // FETCH TEMPLATES

                $('handlebars-template').each(function() {
                    var defer = $.Deferred();
                    var tpl = $(this);
                    var id = tpl.attr('name');
                    var src = tpl.attr('src');

                    promises.push(defer.promise());

                    if (isDefined(src)) {
                        $.ajax({
                            async: true,
                            url: src,
                            success: function(data) {

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

                $.when.apply($, promises).then(function() {
                    $(document).trigger('templates.registered');
                }, function(e) {
                    $(document).trigger('app.failed');
                });
            },

            addTemplate: function(type, name, src) {
                var target = $('#app');
                var action = 'prepend';

                if (type === "content") {
                    target = target.find('.content');
                    action = 'append';
                }

                // REMOVE TEMPLATE IF ALREADY PRESENT IN BODY
                var existing = target.find('handlebars-template[name="' + name + '"]');
                if (existing.length != 0 && existing.attr('override') !== 'true') {
                    existing.remove();
                    delete app.core.ui.templates[name];
                }

                if (existing.attr('override') !== 'true') {
                    // ADDING TEMPLATE IN BODY
                    target[action](
                        $('<handlebars-template/>').attr({
                            name: name,
                            src: src
                        })
                    );
                }
            },

            // -------------------------------------------------------------------------
            // APPLY COMPILED TEMPLATE
            // -------------------------------------------------------------------------

            applyTemplate: function(name, data) {
                $('handlebars-template[name="' + name + '"]').html(
                    app.core.ui.renderTemplate(name, data)
                );

                $(document).trigger('template.applied', [name]);
            },

            // -------------------------------------------------------------------------
            // RETURN COMPILED TEMPLATE
            // -------------------------------------------------------------------------

            renderTemplate: function(name, data) {
                if (undefined !== app.core.ui.templates[name]) {
                    var compiled = Handlebars.compile(app.core.ui.templates[name].data);

                    return compiled(data);
                }

                return false;
            },

            // -------------------------------------------------------------------------
            // CLEAR .CONTENT PLACEHOLDERS
            // -------------------------------------------------------------------------

            clearContent: function() {
                $('#app div.content handlebars-template').html('');
                $(document).trigger('content.cleared');
            },

            // -------------------------------------------------------------------------
            // SHOW BIG LOADER IN CONTENT
            // -------------------------------------------------------------------------

            displayContentLoading: function(show) {
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

            toast: function(message, type, delay) {
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
