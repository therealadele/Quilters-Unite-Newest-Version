import { getUncachableStripeClient } from './stripeClient';

async function seedStripeProducts() {
  const stripe = await getUncachableStripeClient();

  const existing = await stripe.products.search({ query: "name:'Quilters Unite Subscription'" });
  if (existing.data.length > 0) {
    console.log('Stripe products already exist, skipping seed');
    return;
  }

  const product = await stripe.products.create({
    name: 'Quilters Unite Subscription',
    description: 'Full access to Quilters Unite - save projects, manage queue, post in forums, and more!',
  });

  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 499,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { plan: 'monthly' },
  });

  const yearlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 4999,
    currency: 'usd',
    recurring: { interval: 'year' },
    metadata: { plan: 'yearly' },
  });

  console.log('Created Stripe products:');
  console.log(`Product: ${product.id}`);
  console.log(`Monthly price: ${monthlyPrice.id} ($4.99/mo)`);
  console.log(`Yearly price: ${yearlyPrice.id} ($49.99/yr)`);
}

seedStripeProducts().catch(console.error);
