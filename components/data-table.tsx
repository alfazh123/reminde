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

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData>[]
    data: TData[],
    handleOpenInfusForm: () => void
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    handleOpenInfusForm
    }: DataTableProps<TData>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useTable({
        features,
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters,
            globalFilter,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const search = String(filterValue).toLowerCase();

            const runId = String(row.getValue("roomId") ?? "").toLowerCase();
            const targetModel = String(row.getValue("name") ?? "").toLowerCase();

            return runId.includes(search) || targetModel.includes(search);
        },
    })

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between">
                <div className="flex w-fit items-center bg-input/50 rounded-md px-2 py-1 focus:ring-1 focus:ring-ring/50 focus-within:ring-1 focus-within:ring-ring/50">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Filter by ID or Target model"
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="bg-transparent active:border-none focus:ring-0 focus-within:ring-0 focus:outline-none focus-visible:ring-0 focus:border-none border-0"
                    />
                </div>

                <Button variant="default" className="w-fit" onClick={handleOpenInfusForm}>
                    Add Data Infus
                </Button>
            </div>

            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                            )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            <table.FlexRender cell={cell} />
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
    )
}