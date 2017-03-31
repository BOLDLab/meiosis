module.exports = {
  modules: {
    autoRequire: {
      // outputFileName : [ entryModule ]
        'js/app.js' : ['logic'],
    }
  },
  npm: {
   globals: {
      $: 'jquery',
      jQuery:'jquery',
      introJs: 'intro.js',
      jsPDF: 'jspdf',
      bootbox: 'bootbox'
    },
    styles: {
        "intro.js": ['introjs.css'],
        "bootstrap-css": ['lib/modals.css', 'lib/buttons.css', 'lib/wells.css', 'lib/scaffolding.css', 'lib/code.css', 'lib/normalize.css', 'lib/grid.css', "lib/forms.css",
        'lib/navs.css', 'lib/close.css']
    }
  },
  files: {
  javascripts:
       {
         joinTo:{
          'js/app.js': /^app/,
          'js/vendor.js': /^node_modules/,
        }
      },
      stylesheets: {
        joinTo: { 'css/app.css' : /^app/,
                'css/vendor.css' : /^node_modules/,
              }
    },
  },
 plugins: {
    uglify: {
      mangle: true,
      compress: {
        global_defs: {
          DEBUG: false
        }
      }
    },
  },
  javascript: {
    validate: true,
  },
  server: {
    port: 3333,
    hostname: '0.0.0.0',
    base: '/',
    stripSlashes: true
  }
};
