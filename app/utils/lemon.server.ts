import { remember } from '@epic-web/remember'
import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

export const lemonConfig = remember('lemon', () => {
	return lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY })
})
