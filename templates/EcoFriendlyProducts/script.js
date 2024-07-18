// script.js

document.addEventListener('DOMContentLoaded', function() {
    const viewAllProductsButton = document.getElementById('viewAllProducts');

    viewAllProductsButton.addEventListener('click', function() {
        // Redirect to the products.html page
        window.location.href = 'products.html';
    });
});

// Define your products data (example using JSON)
const products = {
    "items": [
        {
            "id": 1,
            "imageSrc": "images/p1.png",
            "imageAlt": "Image of Ring",
            "name": "Ring",
            "price": 200,
            "label": "New"
        },
        {
            "id": 2,
            "imageSrc": "images/p2.png",
            "imageAlt": "Image of Watch ",
            "name": "Watch",
            "price": 350,
            "label": "New"
        },
        {
            "id": 3,
            "imageSrc": "images/p3.png",
            "imageAlt": "Image of Teddy Bear",
            "name": "Teddy Bear",
            "price": 110,
            "label": "New"
        },
        {
            "id": 4,
            "imageSrc": "images/p4.png",
            "imageAlt": "Image of Flower Bouquet",
            "name": "Flower Bouquet",
            "price": 45,
            "label": "New"
        },
        {
            "id": 3,
            "imageSrc": "images/p5.png",
            "imageAlt": "Image of Teddy Bear",
            "name": "Teddy Bear",
            "price": 95,
            "label": "New"
        },
        {
            "id": 4,
            "imageSrc": "images/p6.png",
            "imageAlt": "Image of Flower Bouquet",
            "name": "Flower Bouquet",
            "price": 70,
            "label": "New"
        },
        {
            "id": 3,
            "imageSrc": "images/p7.png",
            "imageAlt": "Image of Watch",
            "name": "Watch",
            "price": 400,
            "label": "New"
        },
        {
            "id": 4,
            "imageSrc": "images/p8.png",
            "imageAlt": "Image of Ring",
            "name": "Ring",
            "price": 450,
            "label": "New"
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    const productContainer = document.getElementById('product-container');

    // Loop through each product and create HTML elements
    products.items.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        // Construct the inner HTML for each product
        productDiv.innerHTML = `
            <img src="${product.imageSrc}" alt="${product.imageAlt}">
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            <span class="label">${product.label}</span>
        `;

        // Append each product div to the container
        productContainer.appendChild(productDiv);
    });
});

