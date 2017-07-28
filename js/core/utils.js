app.register({
    core: {
        utils: {
            init: function() {

                // -----------------------------------------------------------------
                // HANDLEBAR MISSING IF
                // -----------------------------------------------------------------

                Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {

                    switch (operator) {
                        case '==':
                            return (v1 == v2) ? options.fn(this) : options.inverse(this);
                        case '===':
                            return (v1 === v2) ? options.fn(this) : options.inverse(this);
                        case '!=':
                            return (v1 != v2) ? options.fn(this) : options.inverse(this);
                        case '!==':
                            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                        case '<':
                            return (v1 < v2) ? options.fn(this) : options.inverse(this);
                        case '<=':
                            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                        case '>':
                            return (v1 > v2) ? options.fn(this) : options.inverse(this);
                        case '>=':
                            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                        case '&&':
                            return (v1 && v2) ? options.fn(this) : options.inverse(this);
                        case '||':
                            return (v1 || v2) ? options.fn(this) : options.inverse(this);
                        case 'null':
                            return (v1 === null) ? v2.fn(this) : v2.inverse(this);
                        case 'not null':
                            return (v1 !== null) ? v2.fn(this) : v2.inverse(this);
                        default:
                            return options.inverse(this);
                    }
                });

                // -----------------------------------------------------------------
                // RENDER DATE / DATETIME
                // -----------------------------------------------------------------

                Handlebars.registerHelper('formatDate', function(dateStr, format) {
                    var date = moment(dateStr);
                    return date.format(format);
                });

                // -----------------------------------------------------------------
                // RENDER YES / NO BADGE
                // -----------------------------------------------------------------

                Handlebars.registerHelper('ouiNon', function(boolean) {
                    return (boolean ? '<span class="teal badge white-text">Oui</span>' : '<span class="red badge">Non</span>');
                });

                // -----------------------------------------------------------------
                // EXPOSE CONFIG OBJECT
                // -----------------------------------------------------------------

                Handlebars.registerHelper('config', function(path) {
                    return app.core.utils.deepFind(app.config, path);
                });

                // -----------------------------------------------------------------
                // RENDER TEMPLATE INSIDE ANOTHER ONE
                // -----------------------------------------------------------------

                Handlebars.registerHelper('render', function() {
                    //Remove handlebar context param
                    var args = [];

                    for (var i = 0; i < arguments.length - 1; i++) {
                        args.push(arguments[i]);
                    }

                    //Wrap data in object
                    if(isDefined(args[2])) {
                        var object = {};

                        object[args[2]] = args[1];
                        args[1] = object;
                    }

                   return app.core.ui.renderTemplate(args[0], args[1]);
                });

                // -----------------------------------------------------------------
                // RENDER TEMPLATE INSIDE ANOTHER ONE
                // -----------------------------------------------------------------

                Handlebars.registerHelper('dump', function(variable) {
                  console.debug(variable);
                });

            },

            // ---------------------------------------------------------------------
            // CONVERT FORM (AFTER .serializeArray() ) TO OBJECT
            // ---------------------------------------------------------------------

            formToObject: function(formArray) {

                if (!Array.isArray(formArray)) {
                    if ($(formArray).is('form')) {
                        formArray = $(formArray).serializeArray();
                    }
                }

                var returnArray = {};
                for (var i = 0; i < formArray.length; i++) {
                    var value = formArray[i]['value'];

                    if (value == "true" || value == "false")
                        value = (value == "true");

                    returnArray[formArray[i]['name']] = value;
                }
                return returnArray;
            },

            // ---------------------------------------------------------------------
            // PUTS FIRST LETTER OF STRING IN UPPER CASE
            // ---------------------------------------------------------------------

            ucfirst: function(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },

            // ---------------------------------------------------------------------
            // WRAPPER FOR MOMENT JS PARSE DATE
            // ---------------------------------------------------------------------

            parseDate: function(string, format) {
                var date = null;
                if (isDefined(format))
                    date = moment(string, format).toDate();
                else
                    date = moment(string).toDate();
                return date;
            },

            // ---------------------------------------------------------------------
            // HELPER TO QUERY OBJECT WITH XPATH LIKE
            // ---------------------------------------------------------------------

            deepFind: function(obj, path) {
                var paths = path.split('.'),
                    current = obj,
                    i;

                for (i = 0; i < paths.length; ++i) {
                    if (current[paths[i]] === 'undefined' || current[paths[i]] === null) {
                        return null;
                    } else {
                        current = current[paths[i]];
                    }
                }
                return current;
            },
            uuidV1: function(prefix) {
              return prefix + uuid.v1();
            },
            uuidV4: function(prefix) {
              return prefix + uuid.v4();
            },
            mergeArrays: function(array1, array2) {
              return array1.concat(array2.filter(function (item) {
                return array1.indexOf(item) === -1;
              }));
            }
        }
    }
});

// ---------------------------------------------------------------------
// HELPER FUNCTION TO AVOID « typeof var !== 'undefined' » EVERY WHERE
// ---------------------------------------------------------------------

function isDefined(variable) {
    return typeof variable !== 'undefined';
}
