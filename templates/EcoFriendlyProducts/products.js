// Sample product data
const products = [
  {
    id: 1,
    imageSrc: "images/p1.png",
    imageAlt: "Image of Ring",
    name: "Ring",
    price: 200,
    label: "New"
  },
  {
    id: 2,
    imageSrc: "images/p2.png",
    imageAlt: "Image of Watch",
    name: "Watch",
    price: 350,
    label: "New"
  },
  {
    id: 3,
    imageSrc: "images/p3.png",
    imageAlt: "Image of Teddy Bear",
    name: "Teddy Bear",
    price: 110,
    label: "New"
  },
  {
    id: 4,
    imageSrc: "images/p4.png",
    imageAlt: "Image of Flower Bouquet",
    name: "Flower Bouquet",
    price: 45,
    label: "New"
  },
  {
    id: 5,
    imageSrc: "images/p5.png",
    imageAlt: "Image of Teddy Bear",
    name: "Teddy Bear",
    price: 95,
    label: "New"
  },
  {
    id: 6,
    imageSrc: "images/p6.png",
    imageAlt: "Image of Flower Bouquet",
    name: "Flower Bouquet",
    price: 70,
    label: "New"
  },
  {
    id: 7,
    imageSrc: "images/p7.png",
    imageAlt: "Image of Watch",
    name: "Watch",
    price: 400,
    label: "New"
  },
  {
    id: 8,
    imageSrc: "images/p8.png",
    imageAlt: "Image of Ring",
    name: "Ring",
    price: 450,
    label: "New"
  },
  {
    id: 9,
    imageSrc: "images/slider-img.png",
    imageAlt: "Random",
    name: "Random",
    price: 110,
    label: "New"
  },
  {
    id: 10,
    imageSrc: "images/saving-img.png",
    imageAlt: "Random",
    name: "Random",
    price: 45,
    label: "New"
  },
  {
    id: 11,
    imageSrc: "images/purse.png",
    imageAlt: "Image of Purse",
    name: "Purse",
    price: 95,
    label: "New"
  },
  {
    id: 12,
    imageSrc: "images/logo.png",
    imageAlt: "Random",
    name: "Random",
    price: 70,
    label: "New"
  },
  {
    id: 13,
    imageSrc: "images/line.png",
    imageAlt: "Random",
    name: "Random",
    price: 400,
    label: "New"
  },
  {
    id: 14,
    imageSrc: "images/gifts.png",
    imageAlt: "Random",
    name: "Random",
    price: 450,
    label: "New"
  }
];

// Function to generate and display products
function displayProducts() {
  const productsContainer = document.getElementById('products-container');
  products.forEach(product => {
    const productHtml = `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="box">
          <a href="">
            <div class="img-box">
              <img src="${product.imageSrc}" alt="${product.imageAlt}">
            </div>
            <div class="detail-box">
              <h6>${product.name}</h6>
              <h6>
                Price
                <span>$${product.price}</span>
              </h6>
            </div>
            <div class="new">
              <span>${product.label}</span>
            </div>
          </a>
        </div>
      </div>
    `;
    productsContainer.insertAdjacentHTML('beforeend', productHtml);
  });
}

// Call the function to display products when the page loads
window.onload = displayProducts;
