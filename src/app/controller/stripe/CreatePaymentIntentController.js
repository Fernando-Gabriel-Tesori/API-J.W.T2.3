import * as Yup from 'yup';  // Importando Yup corretamente
import Stripe from 'stripe';  // Usando import para Stripe

// Inicializando o Stripe com a chave secreta
const stripe = new Stripe('sk_test_51Q5Ci5FbYEC7Vq59ciApq0pLBtI6RFOqujQUlKPgDDbtgA8ziVI7c5f2IY5yNj7Dqrcz4B1kNRbLhAbDiEsFyxce00nnRu0V00');

const calculateOrderAmount = (items) => {
    const total = items.reduce((acc, current) => {
        return current.price * current.quantity + acc;
    }, 0);

    return total;
};

class CreatePaymentIntent {
    async store(request, response) {
        const schema = Yup.object().shape({
            products: Yup.array()
                .required()
                .of(
                    Yup.object().shape({
                        id: Yup.number().required(),
                        quantity: Yup.number().required(),
                        price: Yup.number().required(),
                    })
                ),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { products } = request.body;

        const amount = calculateOrderAmount(products);

        // Criando o PaymentIntent com o Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'brl',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Respondendo com o clientSecret e o link para revisar o pagamento no dashboard do Stripe
        response.json({
            clientSecret: paymentIntent.client_secret,
            dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
        });
    }
}

export default new CreatePaymentIntent();
