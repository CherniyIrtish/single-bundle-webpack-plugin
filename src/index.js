const fs = require('fs');


class SingleBundleWebpackPlugin {
    constructor({destination, bundleName, jsFiles, cssFile}) {
        this.destination = destination;
        this.bundleName = bundleName;
        this.jsFiles = jsFiles;
        this.cssFile = cssFile;
        this.ENCODING = 'utf-8';
        this.FILE_MODE = 0o2775;
        this.LINE_BREAKE = '\n';
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap('SingleBundleWebpackPlugin', async () => {
            fs.rmdir(`${this.destination}`, () => {});
            fs.mkdirSync(`${this.destination}`, {recursive: true, mode: this.FILE_MODE});

            const concatedJs = await Promise.all(this.jsFiles.map((path) => fs.promises.readFile(path, this.ENCODING)));
            await fs.promises.writeFile(`${this.destination}/${this.bundleName}.js`, concatedJs.join(this.LINE_BREAKE), this.ENCODING);

            if (!this.cssFile) return;

            const styles = await fs.promises.readFile(this.cssFile, this.ENCODING);
            const cssStyles = this._getCssStyles(styles);

            await fs.appendFile(`${this.destination}/${this.bundleName}.js`, cssStyles,
                (err) => {
                    if (err) {
                        console.log('err ', err)
                    }
                }
            );
        });
    }

    _getCssStyles(styles) {
        return `(function() {
      const styles = ${JSON.stringify(styles)};
      const styleTag = document.createElement('style');

      styleTag.type = 'text/css';
      styleTag.appendChild(document.createTextNode(styles));

      document.getElementsByTagName("head")[0].appendChild(styleTag);

      })()`;
    }
}

module.exports = SingleBundleWebpackPlugin;
