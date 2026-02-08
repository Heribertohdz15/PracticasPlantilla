productForm.addEventListener("submit", async e => {

    e.preventDefault();

    const producto = {
        title: title.value,
        price: price.value,
        category: category.value
    };

    await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });

    alert("Producto creado correctamente (simulado)");

    window.location.href = "index.html";
});
