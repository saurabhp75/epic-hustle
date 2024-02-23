import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2023-10-16',
})

const getStripeEventOrThrow = async (request: Request) => {
	const signature = request.headers.get('stripe-signature')
	const payload = await request.text()
	let event: Stripe.Event

	if (!signature || !payload) {
		throw new Response('Invalid Stripe payload/signature', {
			status: 400,
		})
	}
	try {
		event = stripe.webhooks.constructEvent(
			payload,
			signature,
			process.env.DEV_STRIPE_WEBHOOK_ENDPOINT,
		)
	} catch (err: any) {
		throw new Response(err.message, {
			status: 400,
		})
	}
	return event
}

/**
 * Handles events from Stripe emitted via webhooks.
 * @param request - The incoming request object.
 */
export const handleStripeWebhook = async (request: Request) => {
	const event = await getStripeEventOrThrow(request)

	console.log({ event })

	if (
		event.type === 'checkout.session.completed' ||
		event.type === 'checkout.session.async_payment_succeeded'
	) {
		// This will trigger every time a user pays for the subscription
		const session = event.data.object
		// We get the subscription that was created
		const subscription = session.subscription
		// We somehow store it in our database or do whatever we need to
		// await storeSubscription(subscription)
		console.log({ subscription })
	}

	// We return null here, you could return a response as well, up to you
	return null
}

export const createCheckoutSession = async () => {
	// get the user here somehow, either pass him in as a parameter or add
	// another function that fetches him
	const user = { email: 'email@email.com' }
	// The id of the price you created in your dashboard, this can also be an
	// argument to this function
	const price = 'price_1OlfOESCBlQ42asRvBF2ivIT'
	// Creates a new Checkout Session for the order
	const session = await stripe.checkout.sessions.create({
		// your site url where you want user to land after checkout completed
		success_url: 'http://localhost:3000/stripe/products',
		// your site url where you want user to land after checkout canceled
		cancel_url: 'http://localhost:3000/stripe/products',
		// users email, if you create a customer before this step you can assign the customer here too.
		customer_email: user.email,
		// Items to be attached to the subscription
		line_items: [
			{
				price,
				quantity: 1,
			},
		],
		mode: 'subscription',
	})
	// The url to redirect the user to for him to pay.
	return session.url
}
