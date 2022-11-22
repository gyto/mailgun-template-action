import * as core from "@actions/core";
import * as github from "@actions/github";
import formData from "form-data";
import Mailgun from "mailgun.js";
import fs from "fs";

const mailgun = new Mailgun(formData);

async function run() {
	try {
		const key: string = core.getInput("mailgun-api-key", { required: true });
		const domain: string = core.getInput("mailgun-domain", { required: true });
		const template: string = core.getInput("mailgun-template", { required: true });
		const file: string = core.getInput("html-file", { required: true });
		console.log("1", github);
		console.log("2", github.context);
		const hash = github.context.sha;
		const repo = github.context.repo.repo;

		const description = `Domain template created by Mailgun Template Action from ${repo}`;
		const comment = `Template created with ${hash} from ${repo}`

		const mg = mailgun.client({ username: "api", key });

		fs.readFile(file, { encoding: "utf-8"}, function (error, html) {
			if (!error) {
				const checkIfExist = mg.domains.domainTemplates.get(domain, template);
				if (!checkIfExist) {
					try {
						return mg.domains.domainTemplates.create(domain, {
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
						return mg.domains.domainTemplates.createVersion(domain, template, {
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

run();
