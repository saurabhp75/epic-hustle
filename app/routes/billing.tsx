import { invariantResponse } from '@epic-web/invariant'
import {
	getStore,
	// getSubscription,
	listSubscriptions,
} from '@lemonsqueezy/lemonsqueezy.js'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
// import { requireUserId } from '#app/utils/auth.server'
import { lemonConfig } from '#app/utils/lemon.server'

export async function loader({ request }: LoaderFunctionArgs) {
	invariantResponse(lemonConfig, 'lemonConfig not found', { status: 500 })
	try {
		const subsList = await listSubscriptions({
			include: ['order', 'customer', 'product'],
			filter: { storeId: process.env.LEMON_SQUEEZY_STORE_ID },
		})

		const { error, data, statusCode } = await getStore(
			process.env.LEMON_SQUEEZY_STORE_ID as string,
			{
				include: ['orders', 'products'],
			},
		)

		if (!error) {
			// console.log({ store })
			console.dir({ data })
		} else {
			throw new Error(`Error in getStore, code:${statusCode}`)
		}

		// const subs = await getSubscription(subscriptionId, {
		// 	include: ['order', 'subscription-items'],
		// })
		// return json({ subs })
		return json({ subsList })
	} catch (error) {
		throw new Error('something went wrong in billing')
	}
}

export default function BillingRoute() {
	const subsList = useLoaderData<typeof loader>()

	console.log({ subsList })

	return (
		<div>
			<h1>Billing</h1>
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: () => <p>Yeah, you can't be here...</p>,
				500: ({ error }) => (
					<p>
						statusText:"{error.statusText}" status:"{error.status}" data:"
						{error.data}"
					</p>
				),
			}}
		/>
	)
}
