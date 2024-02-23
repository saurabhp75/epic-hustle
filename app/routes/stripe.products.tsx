import { Button } from '#app/components/ui/button'
import { useStripeCheckout } from './resources+/stripe.checkout'

export default function Route() {
	const fetcher = useStripeCheckout()
	return <Button onClick={() => fetcher.submit()}> Checkout </Button>
}
