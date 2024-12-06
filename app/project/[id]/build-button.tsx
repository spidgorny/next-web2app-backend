import {PropsWithChildren} from "react";
import {useJobList} from "@/app/project/[id]/project-job";
import {useAsyncWorking} from "spidgorny-react-helpers/use-async-working";
import axios from "axios";
import {Button} from "@nextui-org/react";
import {ErrorAlert} from "@/app/project/[id]/error-alert";
import {Project} from "@/app/project";

export function BuildButton(
	props: PropsWithChildren<{ project: Project; target: string }>,
) {
	const list = useJobList(props.project.id);

	const {isWorking, error, run} = useAsyncWorking(async () => {
		await axios.post(`/api/project/${props.project.id}/queue`, {
			...props.project,
			target: props.target,
		});
		await list.mutate();
	});
	return (
		<div>
			<Button onClick={run} isLoading={isWorking}>
				{props.children}
			</Button>
			<ErrorAlert error={error}/>
		</div>
	);
}
