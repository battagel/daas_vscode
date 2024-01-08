import * as vscode from 'vscode';
import { API } from "./api/api";

export function activate(context: vscode.ExtensionContext) {
	const api_url = "http://127.0.0.1:8080";
	const help_url = "https://matthewbattagel.co.uk/#/help/antonium";
	const api = new API(api_url);

	console.log("DaaS for VSCode successfully launched! 🚀");
	// vscode.window.showInformationMessage('DaaS for VSCode acitve! 🚀');

	// Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    statusBarItem.text = "DaaS";
    statusBarItem.tooltip = "Open DaaS Help";
    statusBarItem.command = "daas.help";
    context.subscriptions.push(statusBarItem);
	statusBarItem.show();

	let helpCommand = vscode.commands.registerCommand('daas.help', function() {
		// Open the URL in the default web browser
		vscode.env.openExternal(vscode.Uri.parse(help_url));
	});

    let onHover = vscode.languages.registerHoverProvider('*', {
        async provideHover(document, position, token) {
            const wordRange = document.getWordRangeAtPosition(position);
            const word = wordRange ? document.getText(wordRange) : '';

			// console.log(`${word}`);
            if (word) {
				const phrase_item = await api.get(word);
				console.log(phrase_item);
				if (phrase_item === undefined) {
					console.log("Failed to find phrase");
				} else {
					// Create a hover message with the database result
					const hoverMessage = new vscode.MarkdownString();
					const number_explanations = phrase_item.explanations.length;
					var tooltip_text =
						"<span style='padding: 10px; position: absolute;'><b>" +
						phrase_item.phrase +
						"</b>" +
						" - " +
						number_explanations +
						" potential meaning(s)";

					for (const explanation of phrase_item.explanations) {
						// Add definitions, then add links
						if (explanation.definition) {
							tooltip_text += "<hr>Definition:"
							if (explanation.tags.length > 0) {
								tooltip_text += "   - " + explanation.tags
							}
							tooltip_text += "<br>" + explanation.definition;
						}

						if (explanation.code.length > 0) {
							var formatted_code = "<div><br>"
							for (var j = 0; j < explanation.code.length; j++) {
								formatted_code += "<code>" + explanation.code[j] + "</code><br>";
							}
							formatted_code += "</div>";
							tooltip_text += formatted_code
						}

						if (explanation.references.length > 0) {
							var formatted_links = "<ul>";
							for (var k = 0; k < explanation.references.length; k++) {
								formatted_links += "<li>" + explanation.references[k] + "</li>";
							}
							formatted_links += "</ul>";
							tooltip_text += formatted_links
						}
					}
					tooltip_text += "</span>";
					var message = "<div style=' position: relative; display: inline-block;'>" + word + tooltip_text + "</div>";
					console.log(message);
					hoverMessage.appendMarkdown(tooltip_text);
					hoverMessage.supportHtml = true;
					hoverMessage.isTrusted = true;

					return new vscode.Hover(hoverMessage);
				}
            }
            return null; // Return null if there's no word or if there's an error
        }
    });

    context.subscriptions.push(onHover);
    context.subscriptions.push(helpCommand);
}
