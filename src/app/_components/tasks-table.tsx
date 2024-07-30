"use client"
"use memo"

import * as React from "react"
import { tasks, type Task } from "@/db/schema"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"

import { type getTasks } from "../_lib/queries"
import { getPriorityIcon, getStatusIcon } from "../_lib/utils"
import { getColumns } from "./tasks-table-columns"
import { TasksTableFloatingBar } from "./tasks-table-floating-bar"
import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions"

interface TasksTableProps {
  tasksPromise: ReturnType<typeof getTasks>
}

export function TasksTable({ tasksPromise }: TasksTableProps) {
  const enableAdvancedFilter = true

  const { data, pageCount } = React.use(tasksPromise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Task>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter titles...",
    },
    {
      label: "Status",
      value: "status",
      options: tasks.status.enumValues.map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    {
      label: "Priority",
      value: "priority",
      options: tasks.priority.enumValues.map((priority) => ({
        label: priority[0]?.toUpperCase() + priority.slice(1),
        value: priority,
        icon: getPriorityIcon(priority),
        withCount: true,
      })),
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: enableAdvancedFilter,
    defaultPerPage: 10,
    defaultSort: "createdAt.desc",
  })

  const Toolbar = React.useMemo(
    () => (enableAdvancedFilter ? DataTableAdvancedToolbar : DataTableToolbar),
    [enableAdvancedFilter]
  )

  return (
    <DataTable
      table={table}
      floatingBar={<TasksTableFloatingBar table={table} />}
    >
      <Toolbar table={table} filterFields={filterFields}>
        <TasksTableToolbarActions table={table} />
      </Toolbar>
    </DataTable>
  )
}
