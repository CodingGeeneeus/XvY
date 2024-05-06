import { GitRepoData, CommitData } from "~/types"
import { getCommitsPerRepo } from "./getGithubUserData";

export const buildCommitData = (data: GitRepoData[]) => {
  let commits:CommitData[] = []; 

  data.forEach(async (repo: GitRepoData) => {
    const repoData = await getCommitsPerRepo(repo.name, repo.owner.login)

    const amountOfCommits: number = repoData.length

    commits.push({name: repo.name, amount: amountOfCommits})
  })
  return commits
};