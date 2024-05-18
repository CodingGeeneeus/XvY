import { BarChart } from "./BarChart";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton} from "@clerk/nextjs";

import { ClerkUserData, CommitData, GitRepoData} from "~/types";

import { hasGithubConnected } from "../../_utils/hasGithubConnected";
import { getRepos } from "~/app/_utils/getGithubUserData";

import { buildCommitData } from "~/app/_utils/buildChartData";

import { eq } from "drizzle-orm";

interface GraphProps {
	withAuth: boolean;
	passedUsername?: string;
}

export const Graph = async ({passedUsername, withAuth}: GraphProps) => {

	if(passedUsername) {
		const res = await getRepos(passedUsername, withAuth);
		const repos = await res.items

		const commits = buildCommitData(repos, withAuth);

		return (
			<div className="flex w-full my-auto justify-center">
				<div className="flex flex-col text-center">
					<h2 className="mb-4 text-white"><strong>{passedUsername}</strong>: Commits Last 90 Days </h2>
					<BarChart data={commits} />
				</div>
			</div>
		)		
	}

	const user: ClerkUserData | null = await currentUser();

	if(!user) return (
		<p className="w-full text-center">Please 
			<SignInButton>
				<button className="bg-blue-500 hover:bg-blue-700 ml-2 text-white py-2 px-4 rounded">Sign In</button>
			</SignInButton>
		</p>
	)
	if(!hasGithubConnected(user)) return <p className="w-full text-center">Please Connect Your Github Account</p>

	const GithubUserName = user?.username


	const res = await getRepos(GithubUserName, withAuth);
	const repos = res.data.items

	let commits:CommitData[] = [];

	if(!repos.message) { // makes sure rate limit is not hit
		commits = await buildCommitData(repos, withAuth)
	} else {
		console.log("Rate limit hit")
		console.log(repos)
	}

	return (
		<div className="flex w-full my-auto justify-center">
			<div className="flex flex-col text-center">
				<h2 className="mb-4 text-white"><strong>{GithubUserName}</strong>: Commits Last 90 Days </h2>
				<BarChart data={commits} />
			</div>
		</div>
	)
}
