import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { type ColumnDef } from '@tanstack/react-table'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { Spacer } from '#app/components/spacer'
import { Button } from '#app/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	// DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu'
import { Icon } from '#app/components/ui/icon'
import { DataTable } from '#app/components/user-table'
import { prisma } from '#app/utils/db.server'
import { requireUserWithRole } from '#app/utils/permissions.server'

type AppUser = ReturnType<typeof useLoaderData<typeof loader>>[number]

export const columns: ColumnDef<AppUser>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'username',
		header: 'Username',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			// const payment = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<Icon name="dots-vertical">
								<span className="sr-only">System</span>
							</Icon>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
						<DropdownMenuItem>Delete</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View details</DropdownMenuItem>
						<DropdownMenuItem>Edit</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

export async function loader({ request }: LoaderFunctionArgs) {
	// lock down this route to only users with the "admin" role with the
	// requireUserWithRole utility
	await requireUserWithRole(request, 'admin')
	const users = await prisma.user.findMany({
		select: { id: true, name: true, username: true, email: true },
	})
	return json(users.filter(user => user.username !== 'kody'))
}

export default function AdminRoute() {
	const users = useLoaderData<typeof loader>()
	// console.log(typeof users)
	const data = users

	return (
		<div className="container pb-32 pt-20">
			<div className="flex flex-col justify-center">
				<div className="text-center">
					<h1 className="text-h1">Admin Page</h1>
				</div>
			</div>
			<Spacer size="xs" />

			<div className="container mx-auto py-10">
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	)
}
export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: () => <p>Yeah, you can't be here...</p>,
			}}
		/>
	)
}
