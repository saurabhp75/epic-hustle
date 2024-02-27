import { invariantResponse } from '@epic-web/invariant'
import { type ActionFunctionArgs } from '@remix-run/node'
import { lemonConfig, validateEvent } from '#app/utils/lemon.server'

// This lemonsqueezy webhook will listen to following events
// 1. order_created
// 2. subscription_created
// 3. subscription_updated
// 4. subscription_cancelled
// 5. subscription_payment_failed
// 6. subscription_cancelled
export async function action({ request }: ActionFunctionArgs) {
	invariantResponse(lemonConfig, 'lemonConfig not found', { status: 500 })

	try {
		await validateEvent(request)
		const rawBody = await request.text()

		const data = JSON.parse(rawBody)
		console.log({ data })

		console.log(request)
		return new Response('OK')
	} catch (error) {
		// throw error
		const msg = error instanceof Error ? error.message : 'Error in webhook'
		throw new Response(msg, { status: 500 })
	}
}
