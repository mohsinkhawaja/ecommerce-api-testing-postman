import { readFileSync } from 'node:fs';

const products = JSON.parse(readFileSync(new URL('../test-data/catalog.json', import.meta.url)));
const shipping = { id: 'ship_ground', amount: 500 };
const code = (status, name) => [status, { code: name }];

export function makeRouter() {
  const inventory = new Map(products.map(({ variant, stock }) => [variant, stock]));
  const carts = new Map();
  const orders = new Map();
  const view = (cart) => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const discount_total = cart.promo ? Math.floor(subtotal * 0.1) : 0;
    const shipping_total = cart.shipping ? shipping.amount : 0;
    return { ...cart, subtotal, discount_total, shipping_total, total: subtotal - discount_total + shipping_total };
  };
  const cartResult = (cart) => [200, { cart: view(cart) }];

  function editLine(cart, variantId, quantity, existingLine) {
    const product = products.find(({ variant }) => variant === variantId);
    if (!product) return code(404, 'VARIANT_NOT_FOUND');
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) return code(400, 'INVALID_QUANTITY');
    const line = existingLine || cart.items.find((item) => item.variant_id === variantId);
    const next = existingLine ? quantity : (line?.quantity || 0) + quantity;
    if (next > inventory.get(variantId)) return code(409, 'INSUFFICIENT_STOCK');
    if (line) line.quantity = next;
    else cart.items.push({ id: `line_${variantId}`, variant_id: variantId, quantity: next, unit_price: product.price });
    return cartResult(cart);
  }

  return ({ method, path, query, body, headers }) => {
    if (path === '/health') return [200, { ready: true }];
    if (headers['x-publishable-api-key'] !== 'fixture-store-key') return code(401, 'STORE_KEY_REQUIRED');
    if (path === '/store/products' && method === 'GET') {
      const limit = Number(query.get('limit') ?? 20);
      const offset = Number(query.get('offset') ?? 0);
      if (!Number.isInteger(limit) || limit < 1 || limit > 50 || !Number.isInteger(offset) || offset < 0) return code(400, 'INVALID_PAGE');
      const matches = products.filter(({ title }) => title.toLowerCase().includes((query.get('q') || '').toLowerCase()));
      return [200, { products: matches.slice(offset, offset + limit), count: matches.length, limit, offset }];
    }
    if (path.startsWith('/fixture/inventory/') && method === 'GET') {
      const variant = path.split('/').at(-1);
      return inventory.has(variant) ? [200, { available: inventory.get(variant) }] : code(404, 'VARIANT_NOT_FOUND');
    }
    if (path === '/store/carts' && method === 'POST') {
      if (body.region_id !== 'reg_fixture') return code(422, 'REGION_REQUIRED');
      const cart = { id: `cart_${carts.size + 1}`, items: [], completed: false, canceled: false };
      carts.set(cart.id, cart);
      return cartResult(cart);
    }
    const orderMatch = path.match(/^\/store\/orders\/([^/]+)$/);
    if (orderMatch && method === 'GET') {
      const order = orders.get(orderMatch[1]);
      return order ? [200, { order }] : code(404, 'ORDER_NOT_FOUND');
    }
    const match = path.match(/^\/store\/carts\/([^/]+)(?:\/(.+))?$/);
    if (!match) return code(404, 'ROUTE_NOT_FOUND');
    const cart = carts.get(match[1]);
    if (!cart) return code(404, 'CART_NOT_FOUND');
    const action = match[2];
    if (!action && method === 'GET') return cartResult(cart);
    if (cart.canceled) return code(409, 'CART_CANCELED');
    if (cart.completed) return code(409, 'CART_COMPLETED');
    if (action === 'line-items' && method === 'POST') return editLine(cart, body.variant_id, body.quantity);
    if (action?.startsWith('line-items/')) {
      const line = cart.items.find(({ id }) => id === action.split('/')[1]);
      if (!line) return code(404, 'LINE_NOT_FOUND');
      if (method === 'POST') return editLine(cart, line.variant_id, body.quantity, line);
      if (method === 'DELETE') {
        cart.items = cart.items.filter(({ id }) => id !== line.id);
        return cartResult(cart);
      }
    }
    if (action === 'promotions' && method === 'POST') {
      if (body.promo_codes?.length !== 1 || body.promo_codes[0] !== 'QA10') return code(422, 'PROMO_INVALID');
      cart.promo = true;
      return cartResult(cart);
    }
    if (!action && method === 'POST') {
      if (typeof body.email !== 'string' || !/^[^@]+@[^@]+\.[^@]+$/.test(body.email) || !body.shipping_address?.country_code) return code(422, 'INVALID_DETAILS');
      cart.email = body.email;
      cart.shipping_address = body.shipping_address;
      return cartResult(cart);
    }
    if (action === 'shipping-methods' && method === 'POST') {
      if (!cart.shipping_address) return code(409, 'ADDRESS_REQUIRED');
      if (body.option_id !== shipping.id) return code(404, 'SHIPPING_NOT_FOUND');
      cart.shipping = true;
      return cartResult(cart);
    }
    if (action === 'fixture-payment' && method === 'POST') {
      if (!cart.shipping) return code(409, 'SHIPPING_REQUIRED');
      if (body.scenario !== 'approved' && body.scenario !== 'declined') return code(400, 'PAYMENT_SCENARIO_INVALID');
      cart.payment = body.scenario;
      return cartResult(cart);
    }
    if (action === 'fixture-cancel' && method === 'POST') {
      cart.canceled = true;
      return cartResult(cart);
    }
    if (action === 'complete' && method === 'POST') {
      if (!cart.items.length) return code(409, 'CART_EMPTY');
      if (!cart.email || !cart.shipping) return code(409, 'DETAILS_REQUIRED');
      if (cart.payment !== 'approved') return code(409, 'PAYMENT_REQUIRED');
      if (cart.items.some(({ variant_id, quantity }) => quantity > inventory.get(variant_id))) return code(409, 'INSUFFICIENT_STOCK');
      for (const { variant_id, quantity } of cart.items) inventory.set(variant_id, inventory.get(variant_id) - quantity);
      cart.completed = true;
      const order = { id: `order_${orders.size + 1}`, cart_id: cart.id, total: view(cart).total, items: structuredClone(cart.items) };
      orders.set(order.id, order);
      return [200, { type: 'order', order }];
    }
    return code(404, 'ROUTE_NOT_FOUND');
  };
}
