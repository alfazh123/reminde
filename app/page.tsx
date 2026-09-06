"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();

	const levelSections = [
		{ label: "Select Level", value: null },
		{ label: "GDH I Lt 1", value: 1 },
		{ label: "GDH I Lt 2", value: 2 },
		{ label: "GDH I Lt 3", value: 3 },
		{ label: "GDH II Lt 3", value: 4 },
		{ label: "GDH II Lt 4", value: 5 },
		{ label: "GDH II Lt 5", value: 6 },
	];

	useEffect(() => {
		const un = sessionStorage.getItem("username");
		if (!un) {
			router.push("/auth/login");
		}
	}, []);

	return (
		<div className="flex flex-col justify-center items-center min-h-screen gap-4">
			<div className="flex flex-col text-center">
				<h1 className="text-2xl font-bold">Please select a level</h1>
				<p className="text-muted-foreground">
					For which you want to view the dashboard
				</p>
			</div>
			<Select items={levelSections}>
				<SelectTrigger className="w-48">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{levelSections.map((section) => (
						<SelectItem
							key={section.value}
							value={section.value}
							className="w-full h-full">
							<Link
								className="mr-2 w-full h-full"
								href={`dashboard/${section.value}`}>
								{section.label}
							</Link>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
