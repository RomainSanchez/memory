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

# If PROD

$ npm install --production
$ ./node_modules/node-sass/bin/node-sass ./sass/styles.scss ./css/styles.css

# If DEV

$ npm install
$ gulp
```

### Configure your application parameters

Copy LiftJS default `parameters.json.dist` and rename as `parameters.json`. You can put this file anywhere you want in your project directory (must be accessible by your web server).

```bash
# in your web project folder
$ cp ./LiftJS/data/parameters.json.dist ./parameters.json
```

### Update your application parameters

```js
// parameters.json
{
    "debug": true, // Set to false for prod env
    "applicationName":"LiftJs", // The name that will be set in title and navbar
    "clientSessionName": "liftJs", // storage key (sessionStorage / localStorage)
    "appUriPrefix": "" // Prefix used for applications URLs : e.g : #/ or ?/ or empty
}
```

### Configure your application index

> You can copy the default LiftJS index.html file and adapt it to fit your needs (change include paths, etc.)

Include LiftJS stylesheet in your document `head`

```html
<link rel="stylesheet" type="text/css" href="LiftJS/css/styles.css">
```

Include LiftJS third party libraries in your document `body` (if you already use any of this third party libraries in your current application, you won't have to include it again)

```html
<script src="LiftJS/js/libs/jquery-3.2.1.min.js"></script>
<script src="LiftJS/js/libs/handlebars-v4.0.5.js"></script>
<script src="LiftJS/js/libs/materialize.min.js"></script>
<script src="LiftJS/js/libs/moment-with-locales.min.js"></script>
```

Include LiftJS core components in your document `body` after third party libraries

```html
<script type="text/javascript" src="LiftJS/js/app.js"></script>
<script type="text/javascript" src="LiftJS/js/core/utils.js"></script>
<script type="text/javascript" src="LiftJS/js/core/ui.js"></script>
<script type="text/javascript" src="LiftJS/js/core/controller.js"></script>
<script type="text/javascript" src="LiftJS/js/core/events.js"></script>
<script type="text/javascript" src="LiftJS/js/core/session.js"></script>
<script type="text/javascript" src="LiftJS/js/core/history.js"></script>
<script type="text/javascript" src="LiftJS/js/core/modal.js"></script>
<script type="text/javascript" src="LiftJS/js/core/settings.js"></script>
```

**OPTIONAL** : Include LiftJS modules libraries in your document `body` after Lift core components

```html
<script type="text/javascript" src="LiftJS/js/modules/featureDiscovery.js"></script>
```

Include LiftJS core templates

> You can override a template by changing it's src attribute. Targeting your own template will replace existing one (keep the same id in order to replace existing template).

```html
<script id="navbar-template" type="text/x-handlebars-template" src="LiftJS/views/blocks/navbar.html"></script>
<script id="modal-template" type="text/x-handlebars-template" src="LiftJS/views/blocks/modal.html"></script>
<script id="home-template" type="text/x-handlebars-template" src="LiftJS/views/home.html"></script>
<script id="settings-template" type="text/x-handlebars-template" src="LiftJS/views/pages/settings.html"></script>
```

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

Add the handlebars placeholders in your index inside element with id `app`:

```html
<div id="app">

    <!-- PUT HERE PLACEHOLDERS FOR GLOBAL VIEWS -->
    <!-- THESE PLACEHOLDERS WON'T BE CLEARED WHEN VIEW CHANGE -->

    <handlebar-placeholder template="navbar"></handlebar-placeholder>

    <div class="content">
        <!-- PUT HERE PLACEHOLDERS FOR EACH VIEWS -->
        <!-- THESE PLACEHOLDERS WILL BE CLEARED WHEN VIEW CHANGE -->

        <handlebar-placeholder template="home"></handlebar-placeholder>
        <handlebar-placeholder template="settings"></handlebar-placeholder>

        <!-- OPTIONALY : PUT A SPINNER WITH ID = contentLoader -->
        <!-- THIS SPINNER WILL BE SHOWN WHEN VIEW LOADS AND AJAX CALLS -->
        <div id="contentLoader"></div>
    </div>
</div>
```

## Configure your web server

If you use apache, you can use this rewrite rule in order to allow an empty value of `appUriPrefix` parameters.

```apache
<IfModule mod_rewrite.c>
    Options -MultiViews
    RewriteEngine On

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_URI} !^LiftJS
    RewriteRule ^(.*)$ index.html [QSA,L]
</IfModule>
```
> you can see this example in .htaccess-example in LiftJs root folder

That's done !

## For developpers

### Add new view

Create your view template in views/myView.html directory.

```html
<div>
    My View ! and {{ myData }}
</div>
```

Append to index.php the script tag that holds your view template :

With AJAX template loading :

```html
<script id="myView-template" type="text/x-handlebars-template" src="views/myView.html"></script>
```

OR

With loading in index view :

```php
<script id="myView-template" type="text/x-handlebars-template"><?php echo file_get_contents("./views/myView.html"); ?></script>
```

Add action to js/core/controller.js (You should use a custom module instead of editing core's files,  see [Declare a custom module](#declare-a-custom-module) )

```js
app.register({
    ctrl: {
        myView: function () {
            app.core.ctrl.render('myView', {myData: 'myData'}, true);
        },
    }
});
```

Put the view placeholder in index.php

```html
<div id="app">

    <!-- [...] -->

    <handlebar-placeholder template="myView"></handlebar-placeholder>

    <!-- [...] -->

</div>
```

Add a link / button to call your newlly created view

```html
<a href='javascript:;' data-go="myView">
    Go to my new view !
</a>
```

### Declare a custom module

create your module file : js/modules/myModule.js

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

Include it in index.php between app.js (and core files) and app starter

```html
<!-- APP -->

<script type="text/javascript" src="js/app.js"></script>

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

Modules can register their own events by declaring initEvents method :

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

Modules can register their own third party plugins by declaring initPlugins method :

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

your app.myModule.initPlugins() function will be called when all templates will be registered (event « templates.registered »),
a template is applyed (event « templates.applyed ») or a popstate is applyed (via navigator history, event « history.popedstate »)

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
        login : function() {
            // Override app.ctrl.login() action
            alert('Login Action overriden');
        }
    }
});
```
