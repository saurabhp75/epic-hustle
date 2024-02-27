import crypto from 'crypto'
import { invariantResponse } from '@epic-web/invariant'
import { type ActionFunctionArgs } from '@remix-run/node'
import { lemonConfig } from '#app/utils/lemon.server'

// This lemonsqueezy webhook will listen to following events
// 1. order_created
// 2. subscription_created
// 3. subscription_updated
// 4. subscription_cancelled
// 5. subscription_payment_failed
// 6. subscription_cancelled
export async function action({ request }: ActionFunctionArgs) {
	invariantResponse(lemonConfig, 'lemonConfig not found', { status: 500 })
	const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
	try {
		const hmac = crypto.createHmac('sha256', secret)
		const rawBody = await request.text()
		const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
		// const digest = Buffer.from(hmac.update(request.rawBody).digest('hex'), 'utf8')
		// const signature = Buffer.from(request.get('X-Signature') || '', 'utf8')
		const signature = Buffer.from(
			request.headers.get('X-Signature') || '',
			'utf8',
		)

		if (!crypto.timingSafeEqual(digest, signature)) {
			throw new Error('Invalid signature.')
		}

		const data = JSON.parse(rawBody)
		console.log({ data })

		console.log(request)
		return new Response('OK')
	} catch (error) {
		return new Response('ERROR', { status: 500 })
	}
}
