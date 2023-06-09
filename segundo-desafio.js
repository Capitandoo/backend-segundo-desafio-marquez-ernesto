const fs = require ('fs');

class ProductManager {
    constructor () {
        this.path = './productos.json';
    }

    async getProducts () {
        try {
            if (!fs.existsSync (this.path)){
                fs.writeFileSync (this.path, '[]');
            }
            const products = JSON.parse (await fs.promises.readFile (this.path, 'utf8'));
            return products;
        } catch (error) {
            console.log (error);
        }
    }

    async addProduct (product) {
        try{
            const products = await this.getProducts ();
            const id = products.length > 0 ? products[products.length - 1].id : 0;
            const newProduct = { id: id + 1, ...product, };
            if (products.some (p => p.code == product.code)) {
                return console.log ("El codigo debe ser unico");
            }
            products.push(newProduct);
            await fs.promises.writeFile (this.path, JSON.stringify (products));
            return newProduct;
        } catch (error) {
            console.log (error);
        }
    }

    async getProductById (id) {
        try {
            const products = await this.getProducts ();
            const data = products.find (product => product.id === id);
            if (!data) {
                console.log (`El producto con el id ${id} no fue encontrado`);
            }
        return data;
    } catch (error) {
        console.log (error);
    }
    }

    async updateProduct (id, update) {
        try {
            const products = await this.getProducts ();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) {
                return console.log("El producto no fue encontrado");
            }
            products[index] = { ...products[index], ...update };
            await fs.promises.writeFile (this.path, JSON.stringify (products));
            return products[index];
        } catch (error) {
            console.log (error);
        }
    }

    async deleteProduct (id) {
        try {
            const products = await this.getProducts ();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) {
                return console.log (`El producto con id ${id} no fue encontrado`);
            }
            products.splice(index, 1);
            await fs.promises.writeFile (this.path, JSON.stringify (products));
            return console.log (`El Producto con id ${id} a sido borrado`);
        } catch (error) {
            console.log (error);
        }
    }
}

const productos = new ProductManager ();

const test = async () => {

        const products = await productos.getProducts();
        console.log(products);

        const newProduct = await productos.addProduct({
        title: 'test product',
        description: 'This is a test product',
        price: 200,
        thumbnail: 'No image',
        code: 'abc123',
        stock: 25,
        });
        console.log(newProduct);

        const newProduct2 = await productos.addProduct({
        title: 'test product',
        description: 'This is a test product',
        price: 200,
        thumbnail: 'No image',
        code: 'abc123',
        stock: 25,
        });
        console.log(newProduct2);

        const newProduct3 = await productos.addProduct({
        title: 'test product',
        description: 'This is a test product',
        price: 200,
        thumbnail: 'No image',
        code: 'abc124',
        stock: 25,
        });
        console.log(newProduct3);

        await productos.updateProduct(1,{stock: 35});
        console.log (await productos.getProductById (1));
        console.log (await productos.getProductById (3));
        await productos.deleteProduct (3);
        await productos.deleteProduct (1);

        const newProduct4 = await productos.addProduct({
        title: 'test product',
        description: 'This is a test product',
        price: 200,
        thumbnail: 'No image',
        code: 'abc123',
        stock: 25,
        });
        console.log(newProduct4);

        console.log (await productos.getProducts ());
        
    }


test ();

