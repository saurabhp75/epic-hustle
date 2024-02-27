import crypto from 'crypto'
import { remember } from '@epic-web/remember'
import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

export const lemonConfig = remember('lemon', () => {
	return lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY })
})

export async function validateEvent(request: Request) {
	const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
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
}
