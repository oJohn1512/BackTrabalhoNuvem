const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do Supabase
const supabase = supabaseClient.createClient(
    'https://xmtojcnofujkxpsbiqne.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdG9qY25vZnVqa3hwc2JpcW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NTg2MDMsImV4cCI6MjA0NjMzNDYwM30.-JsamkCQOHz10lzBIbo4zHGD0UpGwmydZuXkd9V7qqU'
);

// Rota para consultar todos os produtos
app.get('/products', async (req, res) => {
    const { data, error } = await supabase.from('products').select();
    if (error) {
        return res.status(500).send({ error: 'Failed to fetch products', details: error.message });
    }
    res.status(200).json(data);
});

// Rota para consultar um produto por ID
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('products').select().eq('id', id).single();

    if (error) {
        return res.status(404).send({ error: 'Product not found', details: error.message });
    }
    res.status(200).json(data);
});

// Rota para criar um produto
app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;

    const { error } = await supabase.from('products').insert({ name, description, price });

    if (error) {
        return res.status(500).send({ error: 'Failed to create product', details: error.message });
    }
    res.status(201).send({ message: 'Product created successfully' });
});

// Rota para atualizar um produto
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const { error } = await supabase
        .from('products')
        .update({ name, description, price })
        .eq('id', id);

    if (error) {
        return res.status(500).send({ error: 'Failed to update product', details: error.message });
    }
    res.status(200).send({ message: 'Product updated successfully' });
});

// Rota para deletar um produto
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        return res.status(500).send({ error: 'Failed to delete product', details: error.message });
    }
    res.status(200).send({ message: 'Product deleted successfully' });
});

// Rota principal
app.get('/', (req, res) => {
    res.status(200).send("Hello! Supabase API is working. <3");
});

// Rota para caminhos inválidos
app.use('*', (req, res) => {
    res.status(404).send("Route not found. <3");
});

// Inicia o servidor
app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});
