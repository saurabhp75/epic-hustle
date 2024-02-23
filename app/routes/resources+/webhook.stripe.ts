import { type ActionFunctionArgs } from '@remix-run/node'
import { handleStripeWebhook } from '#app/utils/stripe.server'

export const action = ({ request }: ActionFunctionArgs) =>
	handleStripeWebhook(request)
