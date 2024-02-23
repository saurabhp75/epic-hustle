import { type ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { createCheckoutSession } from '#app/utils/stripe.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	const url = await createCheckoutSession()
	if (!url) {
		return json({ error: 'Something went wrong' }, { status: 500 })
	}
	return redirect(url)
}

/**
 * Used to redirect the user to the Stripe checkout page
 * @returns A custom fetcher with extended submit function
 */
export const useStripeCheckout = () => {
	// This function can accepts price-ids
	// and be more flexible.
	const fetcher = useFetcher<typeof action>()
	return {
		...fetcher,
		// overwrites the default submit so you don't have to specify the action or method
		submit: () =>
			fetcher.submit(null, {
				method: 'POST',
				action: '/resources/stripe/checkout',
			}),
	}
}
