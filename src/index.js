const fs = require('fs');


class SingleBundleWebpackPlugin {
    constructor({destination, bundleName, jsFiles, cssFiles}) {
        this.destination = destination;
        this.bundleName = bundleName;
        this.jsFiles = jsFiles;
        this.cssFiles = cssFiles;
        this.ENCODING = 'utf-8';
        this.FILE_MODE = 0o2775;
        this.LINE_BREAKE = '\n';
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap('SingleBundleWebpackPlugin', async () => {
            fs.rmdir(`${this.destination}`,() => {});
            fs.mkdirSync(`${this.destination}`, {recursive: true, mode: this.FILE_MODE});

            const concatedJs = await Promise.all(this.jsFiles.map((path) => fs.promises.readFile(path, this.ENCODING)));
            const concatedCss = await Promise.all(this.cssFiles.map((path) => fs.readFileSync(path, this.ENCODING)));
            const cssStyles = this._getCssStyles(concatedCss);

            await fs.promises.writeFile(`${this.destination}/${this.bundleName}.js`, concatedJs.join(this.LINE_BREAKE), this.ENCODING);

            await fs.appendFile(`${this.destination}/${this.bundleName}.js`, cssStyles,
                (err) => {
                    if (err) {
                        console.log('err -->> ', err)
                    }
                }
            );
        });
    }

    _getCssStyles(concatedCss) {
        return `(function() {
      const styles = ${JSON.stringify(concatedCss)};
      const styleTag = document.createElement('style');

      styleTag.type = 'text/css';
      styleTag.appendChild(document.createTextNode(styles));

      document.getElementsByTagName("head")[0].appendChild(styleTag);

      })()`;
    }
}

export default SingleBundleWebpackPlugin;
