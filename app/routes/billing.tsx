import { invariantResponse } from '@epic-web/invariant'
import { getStore } from '@lemonsqueezy/lemonsqueezy.js'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { lemonConfig } from '#app/utils/lemon.server'

export async function loader({ request }: LoaderFunctionArgs) {
	invariantResponse(lemonConfig, 'lemonConfig not found', { status: 500 })
	try {
		// const subsList = await listSubscriptions({
		// 	include: ['order', 'customer', 'product'],
		// 	filter: { storeId: process.env.LEMON_SQUEEZY_STORE_ID },
		// })

		// const subs = await getSubscription(subscriptionId, {
		// 	include: ['order', 'subscription-items'],
		// })
		// return json({ subs })

		const { error, data, statusCode } = await getStore(
			process.env.LEMON_SQUEEZY_STORE_ID as string,
			{
				include: ['orders', 'products'],
			},
		)

		if (error) {
			throw new Response(`Error in getStore, code:${statusCode}`, {
				status: 500,
			})
		}
		return json({ data })
	} catch (error) {
		throw new Response('something went wrong in billing', { status: 500 })
	}
}

export default function BillingRoute() {
	const data = useLoaderData<typeof loader>()

	console.log({ data })

	return (
		<div className="grid h-full place-items-center">
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
