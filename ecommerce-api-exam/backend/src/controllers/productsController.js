const Products = require('../models/products');

async function list(req, res, next) {
  try { res.json(await Products.listProducts()); }
  catch (e) { next(e); }
}
async function get(req, res, next) {
  try {
    const p = await Products.getProduct(req.params.id);
    if (!p) return res.status(404).json({ error: 'not found' });
    res.json(p);
  } catch (e) { next(e); }
}
async function create(req, res, next) {
  try {
    const { name, description, price_cents, stock } = req.body;
    const p = await Products.createProduct({ name, description, price_cents, stock });
    res.status(201).json(p);
  } catch (e) { next(e); }
}
async function update(req, res, next) {
  try {
    const { name, description, price_cents, stock } = req.body;
    const p = await Products.updateProduct(req.params.id, { name, description, price_cents, stock });
    res.json(p);
  } catch (e) { next(e); }
}
async function remove(req, res, next) {
  try {
    await Products.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}

module.exports = { list, get, create, update, remove };
