import * as core from "@actions/core";
import github from "@actions/github";
import formData from "form-data";
import Mailgun from "mailgun.js";
import fs from "fs";

const mailgun = new Mailgun(formData);

function manageTemplates() {
	try {
		const key: string = core.getInput("mailgun-api-key");
		const domain: string = core.getInput("mailgun-domain");
		const template: string = core.getInput("mailgun-template");
		const file: string = core.getInput("file");
		const hash = github.context.sha;
		const repo = github.context.repo.repo;

		const description = `Domain template created by Mailgun Template Action from ${repo}`;
		const comment = `Template created with ${hash} from ${repo}`

		const mg = mailgun.client({ username: "api", key });

		fs.readFile(file, { encoding: "utf-8"}, async function (error, html) {
			if (!error) {
				const checkIfExist = mg.domains.domainTemplates.get(domain, template);
				if (!checkIfExist) {
					try {
						await mg.domains.domainTemplates.create(domain, {
							name: template,
							description,
							template: html,
							tag: hash,
							comment,
						})
					} catch (error) {
						core.setFailed(`Cannot create template: ${error.message}`)
					}
				} else {
					try {
						await mg.domains.domainTemplates.createVersion(domain, template, {
							template: html,
							tag: hash,
							comment,
							// @ts-ignore
							active: "yes",
						})
					} catch (error) {
						core.setFailed(`Cannot update template: ${error.message}`)
					}
				}
			} else {
				console.error(`Error: ${file} was not found`);
				throw error;
			}
		})
	} catch (error) {
		core.setFailed(error.message);
	}
}

manageTemplates();
