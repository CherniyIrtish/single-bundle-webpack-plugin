# Single bundle webpack plugin

Small webpack plugin allows pack js/css files to one module.<br />
It's useful for making custom element by adding to webpack config what allows build application and create custom element by one script command.<br />
Angular docs: [Angular custom elements](https://angular.io/guide/elements)<br />
To know more how to create Angular custom elements you can read: [Angular web components workspace](https://medium.com/@komendantov.aleksii/angular-web-components-workspace-882ce0847220)<br />

### Install ###
`npm install single-bundle-webpack-plugin`

### Usage ###
`webpack.config.js`

<pre>
const SingleBundleWebpackPlugin = require("single-bundle-webpack-plugin");

module.exports = {
  plugins: [
    new SingleBundleWebpackPlugin({
      destination: `path to desired folder`
      bundleName: `${projectName}-${date}`,
      jsFiles: [`...path to js file`],
      cssFile: `...path to css file`
    })
  ]
};
</pre>

### Options ###
* destination - path where to save component e.g. `custom-components/first-component`<br />
* bundleName - name future module e.g. `my-new-component-name`<br />
* jsFiles - array of paths to js modules <br />
* cssFile - paths to css styles file <br />


Css style files will be appended to `<head>` as `<style>` tag.
