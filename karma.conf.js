module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'www/libs/angular/angular.js',
      'www/libs/angular-route/angular-route.js',
      'www/libs/angular-mocks/angular-mocks.js',
      'www/libs/components/**/*.js',
      'www/app*/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
