// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const axios = require("axios");
const cheerio = require("cheerio");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    const res = await axios.get("https://fig.io/blog");
    const $ = cheerio.load(res.data);
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    const articles = $("article").map(function (i, article) {
        return {
            label: article.children[1].children[0].children[0].data,
            detail: article.children[2].children[0].data,
            link:
                "https://fig.io" +
                article.children[1].children[0].children[0].parent.attribs.href,
        };
    });

    // $("article").each(function () {
    //     const articleName = this.children[1].children[0].children[0].data;
    //     const articleLink =
    //         this.children[1].children[0].children[0].parent.attribs.href;

    //     const articleDescription = this.children[2].children[0].data;
    //     console.log(articleName);
    //     console.log(articleDescription);
    //     console.log("https://fig.io" + articleLink);
    // });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        "figextension.searchFigBlogs",
        async function () {
            const article = await vscode.window.showQuickPick(articles, {
                matchOnDetail: true,
            });

            if (article == null) return;
            vscode.env.openExternal(article.link);
            // The code you place here will be executed every time your command is executed

            // Display a message box to the user
            vscode.window.showInformationMessage(
                "Thanks for using Fig Blog Search!"
            );
        }
    );

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
