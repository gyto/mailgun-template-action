import * as core from "@actions/core";
import * as github from "@actions/github";
import formData from "form-data";
import Mailgun from "mailgun.js";
import fs from "fs";

const mailgun = new Mailgun(formData);

try {
	const key: string = core.getInput("mailgun-api-key", { required: true });
	const domain: string = core.getInput("mailgun-domain", { required: true });
	const template: string = core.getInput("mailgun-template", { required: true });
	const file: string = core.getInput("html-file", { required: true });
	const hash = github.context.sha;
	const repo = github.context.repo.repo;

	const description = `Domain template created by Mailgun Template Action from ${repo}`;
	const comment = `Template created with ${hash} from ${repo}`

	const mg = mailgun.client({ username: "api", key });

	fs.readFile(file, { encoding: "utf-8"}, async function (error, html) {
		if (!error) {
			try {
				await mg.domains.domainTemplates.get(domain, template)
					.catch(async (error) => {
						if (error.status === 404) {
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
							core.setFailed(`Cannot read domain templates ${error.message}`);
						}
					});

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
		} else {
			console.error(`Error: ${file} was not found`);
			throw error;
		}
	})
} catch (error) {
	core.setFailed(`Error in try catch ${error.message}`);
}
