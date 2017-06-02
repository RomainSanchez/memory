# LiftJS : Libre-Informatique Frontend Tool

A JavaScript frontend application developped with popular javascript / html / css libraries

![Application preview](img/preview.png)

[![License](https://img.shields.io/github/license/libre-informatique/LiftJS.svg?style=flat-square)](./LICENCE.md)

## Third party libraries

-   jQuery : <https://jquery.com/>
-   MaterializeCss : <http://materializecss.com/>
-   Material Icons : <https://material.io/icons/>
-   HandlebarsJS : <http://handlebarsjs.com/>
-   MomentJS : <https://momentjs.com/>

## Installation

### Install liftJs in your web project

```bash
# in your web project folder
$ mkdir ./LiftJS/
$ cd ./LiftJS/
$ git clone https://github.com/libre-informatique/LiftJS.git .
```

## Integrate liftJs to your project

### Initialize parameters

Copy LiftJS default `parameters.json.dist` and rename as `parameters.json`. You can put this file anywhere you want in your project directory (must be accessible by your web server).

```bash
# in your web project folder
$ cp ./LiftJS/data/parameters.json.dist ./parameters.json
```

### Update parameters

```js
// parameters.json
{
    "liftJsPath":"LiftJs/", // The web path to liftJs install dir
    "applicationName":"LiftJs", // The name that will be set in title and navbar
    "clientSessionName": "liftJs", // storage key (sessionStorage / localStorage)
    "appUriPrefix": "", // Prefix used for applications URLs : e.g : #/ or ?/ or empty
    "debug": true // Set to false for prod env
}
```

> IMPORTANT: Don't expose sensitives informations in this file ! It is publicly accessible because the application fetch it with an ajax call at startup.

### Set includes

Include LiftJS stylesheet in your document `head`

```html
<link rel="stylesheet" type="text/css" href="LiftJS/dist/liftJs.min.css">
```

Include LiftJS third party libraries in your document `body` (if you already use any of this third party libraries in your current application, you won't have to include it again)

```html
<script src="LiftJS/js/libs/jquery-3.2.1.min.js"></script>
<script src="LiftJS/js/libs/handlebars-v4.0.5.js"></script>
<script src="LiftJS/js/libs/materialize.min.js"></script>
<script src="LiftJS/js/libs/moment-with-locales.min.js"></script>
```

Include the LiftJS distributed file in your document `body` after third party libraries

```html
<script type="text/javascript" src="LiftJS/dist/liftJs.min.js"></script>
```

**OPTIONAL** : Include LiftJS modules libraries in your document `body` after Lift core components

```html
<script type="text/javascript" src="LiftJS/dist/modules/featureDiscovery.min.js"></script>
```

### Add starter

Add the LiftJS app starter script

```html
<!-- APP STARTER -->

<script type="text/javascript">
    // Set your custom host if needed (without trailing slash)
    app.config.host = "https://myhost.dev";
    // Set your custom parameters.json path
    app.config.parametersPath = "/parameters.json"

    // START APP
    $(document).ready(app.init());
</script>
```

### Declare templates

Include LiftJS core templates in your `index.html`.

You have 3 options:

-   Let the module include the template automatically.
-   Include a template in `div` with class `.content`. The template will be cleared after calling `app.core.ctrl.go(templateName,data)` and `app.core.ctrl.render(templateName,data,true)`.
-   Include a template in `div` with id `#app`. The template won't be cleared after calling `app.core.ctrl.go(templateName,data)` and `app.core.ctrl.render(templateName,data,true)`.

> You can override a template by changing it's src attribute. Targeting your own template will replace existing one (keep the same id in order to replace existing template).

```html
<div id="app">

    <div class="content">

        <!-- OVERRIDEN HOME VIEW -->
        <handlebars-template name="home" src="views/home.html" override="true"></handlebars-template>

    </div>

    <!-- OPTIONAL : PUT A SPINNER WITH ID = #contentLoader -->
    <!-- THIS SPINNER WILL BE SHOWN WHEN VIEW LOADS AND AJAX CALLS -->
    <div id="contentLoader"></div>
</div>
```

## Configure web server

If you use `apache`, you can use this rewrite rule in order to allow an empty value of `appUriPrefix` parameters.

```apache
<IfModule mod_rewrite.c>
    Options -MultiViews
    RewriteEngine On

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_URI} !^LiftJS
    RewriteCond %{REQUEST_URI} !^js
    RewriteCond %{REQUEST_URI} !^css
    RewriteCond %{REQUEST_URI} !^img
    RewriteCond %{REQUEST_URI} !^fonts
    RewriteCond %{REQUEST_URI} !^views
    # RewriteCond %{REQUEST_URI} !^anyDirectoryOrFileYouWantToBeAccessible
    RewriteRule ^(.*)$ index.html [QSA,L]
</IfModule>
```

> you can see this example in .htaccess-example in LiftJs root folder

That's done !

## For developpers

### Add new view

Create your view template in `views/myView.html` directory.

```html
<div>
    My View ! and {{ myData }}
</div>
```

Put the view template in `index.html`

```html
<div id="app">

    <!-- [...] -->

    <div class="content">
        <handlebars-template name="myView" src="views/myView.html"></handlebars-template>
    </div>

    <!-- [...] -->

</div>
```

Add action to `js/core/controller.js` (You should use a custom module instead of editing core's files, see [Declare a custom module](#declare-a-custom-module) )

```js
app.register({
    ctrl: {
        myView: function () {
            app.core.ctrl.render('myView', {myData: 'myData'}, true);
        },
    }
});
```

Add a link / button to call your newlly created view

```html
<a href='javascript:;' data-go="myView">
    Go to my new view !
</a>
```

### Declare a custom module

Create your module file `js/modules/myModule.js`

```js
app.register({
    myModule: {
        aProperty: null,
        aMethod: function() {
            alert('myModule myMethod !');
        },
    }
});
```

Include it in `index.html` between `liftJs.min.js` and [app starter](#add-starter)

```html
<!-- APP -->

<script type="text/javascript" src="LiftJS/dist/liftJs.min.js"></script>

<!-- [...] -->

<!-- MY CUSTOM MODULES -->

<script type="text/javascript" src="js/modules/myModule.js"></script>

<!-- APP STARTER -->

<script type="text/javascript">
    // START APP
    $(document).ready(app.init());
</script>
```

Your module is now available through `app.myModule`.

Example of usage :

```js
console.info(app.myModule.aMethod());
```

### Custom module events

Modules can register their own events by declaring `initEvents` method :

```js
app.register({
    myModule: {
        initEvents: function() {
            $(document)
                .on('click','a',function() {
                    app.myModule.aMethod();
                });
        }
    }
});
```

### Custom module plugins

Modules can register their own third party plugins by declaring `initPlugins` method :

```js
app.register({
    myModule: {
        initPlugins: function() {
            // Example: init bootstrap tooltips
            $('[data-toggle="tooltip"]').tooltip();
        }
    }
});
```

Your `app.myModule.initPlugins()` function will be called when all templates will be registered (event `templates.registered`), a template is applied (event `templates.applied`) or a popstate is applied (via navigator history, event `history.popedstate`)

### Custom module templates

You can register template with the function `registerTemplates`. Use ui function `app.core.ui.addTemplate(type, name, src);` to add a template (src will be prefixed with parameter `liftJsPath`).

```js
app.register({
    myModule: {
        registerTemplates: function() {
            // Adds a global view / block
            app.core.ui.addTemplate('app', 'myGlobalView', 'js/modules/myModule/views/myGlobalView.html');
            // Adds a content view (will be cleared when changing page)
            app.core.ui.addTemplate('content', 'myContentView', 'js/modules/myModule/views/myContentView.html');
        },
    }
});
```

### Module and application override

Modules can override any part of methods / properties / module :

```js
app.register({
    myModule: {

    },

    ctrl: {
        myAction: function() {
            // Append new method to app.core.ctrl
            alert('Action called with app.ctrl.myAction()');
        },
        homeAction : function() {
            // Override app.ctrl.homeAction() action
            alert('Home Action overriden');
        }
    }
});
```
