// webpack.config.js
var Encore = require('@symfony/webpack-encore');
var glob = require("glob");

Encore
    // the project directory where all compiled assets will be stored
    .setOutputPath('Resources/public/build')

    // the public path used by the web server to access the previous directory
    .setPublicPath('/public/build')

    // will create public/build/app.js and public/build/app.css
    .addEntry('js/cms', './Resources/assets/js/cms.js')

    .addEntry('css/style', './Resources/assets/scss/style.scss')
    // .addEntry('images', glob.sync('./Resources/assets/images/*'))

    // allow legacy applications to use $/jQuery as a global variable
    .autoProvidejQuery()

    // enable source maps during development
    .enableSourceMaps(!Encore.isProduction())

    // empty the outputPath dir before each build
    .cleanupOutputBeforeBuild()

    // show OS notifications when builds finish/fail
    .enableBuildNotifications()

    // create hashed filenames (e.g. app.abc123.css)
    // .enableVersioning()

    // disabled versionning
    // .configureFilenames({
    //     images: 'images/[name].[ext]',
    //     fonts: 'fonts/[name].[ext]'
    //  })



// allow sass/scss files to be processed
    .enableSassLoader()
;

// export the final configuration
module.exports = Encore.getWebpackConfig();