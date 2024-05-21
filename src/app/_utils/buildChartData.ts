import { CommitData, GitRepoData } from "~/types";
import { getCommitsPerRepo } from "../_services/getGithubUserData";

export const buildCommitData = async (
	data: GitRepoData[],
	withAuth: boolean,
	token: string | null,
) => {
	let commits: CommitData[] = [];

	if (data) {
		for (let i = 0; i < data.length; i++) {
			const repo = data[i];
			if (repo) {
				const repoData = await getCommitsPerRepo(
					repo.name,
					repo.owner.login,
					withAuth,
				);

				const amountOfCommits: number = repoData.data.length;

				commits.push({
					name: repo.name,
					amount: amountOfCommits,
					repoURL: repo.html_url,
				});
			}
		}
	} else {
		console.error("no data");
	}
	return commits;
};
