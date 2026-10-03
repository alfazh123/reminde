"use client"

import { ColumnFiltersState, useTable, type ColumnDef, type RowData } from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { features, type DataTableFeatures } from "./data-table-features"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { categoryFilter, levelSections } from "@/app/utils";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DataTableProps<TData extends RowData> {
	columns: ColumnDef<DataTableFeatures, TData>[];
	data: TData[];
	handleOpenInfusForm: () => void;
	handleOpenCateterForm: () => void;
	levelValue: number | null;
}

export function DataTable<TData extends RowData>({
	columns,
	data,
	handleOpenInfusForm,
	handleOpenCateterForm,
	levelValue,
}: DataTableProps<TData>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [category, setCategory] = useState<string | null>(null);

	const handleCategoryChange = (val: string | null) => {
		// if (val === null) {
		// 	setCategory(null);
		// 	table.getColumn("category")?.setFilterValue("");
		// 	return;
		// }
		setCategory(val);
		table.getColumn("category")?.setFilterValue(val === "all" ? "" : val);
	};

	const table = useTable({
		features,
		data,
		columns,
		onColumnFiltersChange: setColumnFilters,
		state: {
			columnFilters,
			globalFilter,
		},
		globalFilterFn: (row, filterValue) => {
			const search = String(filterValue).toLowerCase();

			const roomId = String(row.getValue("roomId") ?? "").toLowerCase();

			return roomId.includes(search);
		},
	});

	const currentSection = levelSections.find((s) => s.value === levelValue);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap justify-between gap-2">
				<div className="flex w-fit items-center bg-input/50 rounded-md px-2 py-1 focus:ring-1 focus:ring-ring/50 focus-within:ring-1 focus-within:ring-ring/50">
					<Search className="h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search Room ID"
						value={globalFilter}
						onChange={(event) =>
							setGlobalFilter(event.target.value)
						}
						className="bg-transparent active:border-none focus:ring-0 focus-within:ring-0 focus:outline-none focus-visible:ring-0 focus:border-none border-0"
					/>
				</div>

				<div className="flex flex-wrap gap-2 items-center">
					<DropdownMenu>
						<DropdownMenuTrigger
							render={<Button variant="default">Add Data</Button>}
						/>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={handleOpenInfusForm}>
								Add Data Infus
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleOpenCateterForm}>
								Add Data IV Cateter
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Select
						items={categoryFilter}
						onValueChange={(value) =>
							handleCategoryChange(value ?? null)
						}
						value={category}>
						<SelectTrigger className="w-48">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{categoryFilter.map((section) => (
								<SelectItem
									key={section.value}
									value={section.value}
									className="w-full h-full">
									{section.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						items={levelSections}
						value={currentSection?.value ?? null}>
						<SelectTrigger className="w-48">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{levelSections.map((section) => (
								<Link
									key={section.value}
									className="w-full h-fit"
									href={`/dashboard/${section.value}`}>
									<SelectItem
										value={section.value}
										className="w-full h-full">
										{section.label}
									</SelectItem>
								</Link>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<Table>
				<TableHeader className="bg-muted sticky top-0 z-10">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : (
											<table.FlexRender header={header} />
										)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										<table.FlexRender cell={cell} />
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}