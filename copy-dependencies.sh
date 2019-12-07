#! /bin/bash

# run this script after downloading the dependencies to node_modules using npm

# jquery
cp node_modules/jquery/dist/jquery.min.js js/jquery.min.js

# bootstrap
cp node_modules/bootstrap/dist/js/bootstrap.min.js js/bootstrap.min.js

# bootstrap-datepicker
cp node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css css/bootstrap-datepicker3.min.css
cp node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js js/bootstrap-datepicker.min.js
cp node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.de.min.js locales/bootstrap-datepicker.de.min.js
cp node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.en-GB.min.js locales/bootstrap-datepicker.en-GB.min.js

# bootswatch lumen theme
cp node_modules/bootswatch/lumen/bootstrap.min.css css/bootstrap-bootswatch-theme-lumen.min.css
