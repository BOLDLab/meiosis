module.exports = {
  modules: {
    autoRequire: {
      // outputFileName : [ entryModule ]
        'js/app.js' : ['logic']
    }
 },
 files: {
  javascripts:
       {
         joinTo:{
          'js/app.js': /^app/,
          'js/vendor.js': /node_modules/
        }
  },/*,
  stylesheets: {joinTo: 'app.css'},
    //   templates: {joinTo: 'app.js'}
 */},
 plugins: {
    uglify: {
      mangle: true,
      compress: {
        global_defs: {
          DEBUG: false
        }
      }
    }
  }
};
