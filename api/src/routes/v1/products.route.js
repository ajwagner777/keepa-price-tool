const express = require('express')

const validate = require('../../middlewares/validate')
const productValidation = require('../../validations/product.validation')
const productController = require('../../controllers/product.controller')

const router = express.Router()

router
  .route('/')
  .get(validate(productValidation.getProducts), productController.getProducts)


module.exports = router

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product search API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Search for products
 *     description: Search for products on the Keepa API
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: 
 *           - search
 *         schema:
 *           type: string
 *         description: search string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties: 
 *                       name: 
 *                         type: string
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 */
