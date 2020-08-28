"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRepoFromTemplate = exports.listOrgRepos = exports.reportLimitStats = void 0;
const rest_1 = require("@octokit/rest");
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const auth = 'f7df1f026aa8c66dfcccff159fe91106574fbec5'; // @git-ignore
const octokit = new rest_1.Octokit({
    auth: auth,
    previews: ['baptiste-preview', 'mercy-preview'],
});
/**
 * Reports the Rate Limit stats.
 *
 * Shouldn't be necessary, but you never know how many templates someone may
 * want to make in a given hour.
 */
exports.reportLimitStats = () => {
    octokit.rateLimit.get().then(({ data }) => {
        console.log('Reporting limits...');
        console.log(`You're currently at ${data.rate.remaining}/${data.rate.limit}.`);
        console.log(`Limit resets on ${new Date(data.rate.reset * 1000)}.`);
    });
};
/**
 * Lists the repositories under the given `org`
 *
 * @param org The GitHub Organization of interest.
 * @param topics If passed, we look for repos with only these topics.
 */
exports.listOrgRepos = (org, topics) => {
    octokit.repos
        .listForOrg({
        org,
    })
        .then(({ data }) => {
        data.forEach((repo) => {
            if (repo.is_template) {
                if (topics) {
                    if (topics.every((topic) => repo.topics.includes(topic))) {
                        console.log(repo.name);
                        console.log(repo.topics);
                    }
                }
            }
            else {
                console.log(`Uh oh... No templates found.`);
            }
        });
    });
};
/** generateRepoFromTemplate(_, reaxpress, new-repo)*/
exports.generateRepoFromTemplate = (templateRepoName, newRepoOwner, newRepoName, newRepoDesc, newRepoPriv) => {
    octokit.repos
        .createUsingTemplate({
        template_owner: 'noderalis',
        template_repo: templateRepoName,
        owner: newRepoOwner,
        name: newRepoName,
        description: newRepoDesc ? newRepoDesc : undefined,
        private: newRepoPriv,
    })
        .then(({ data }) => {
        console.log(`Successfully created ${data.name} at ${data.html_url}`);
        const clone = new Promise((res, rej) => {
            console.log(`Cloning into ${data.name}/`);
            cross_spawn_1.default('git', [
                'clone',
                'https://github.com/Noderalis/noderalis.git',
                data.name,
            ]);
            rej("Seems we've struck land, sir...");
        });
        if (true) {
            clone;
        }
    });
};
exports.generateRepoFromTemplate('reaxpress', 'noderalis', 'holy-shit-robin', 'a repo created from a template via Noderalis');
/*!
 * Commands
  - "list, l [--topics, -t]" List the templates available on GitHub
  - "generate, g <template> [--token, -t]" Generate a template under the user's account. Can pass an auth_token.
 */
