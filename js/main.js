"use strict";

const inputs = document.querySelectorAll("form input");
const tableBody = document.querySelector("tbody");
const form = document.getElementById("form");
const sub = document.getElementById("sub");
const cancel = document.getElementById("cancelUpdate");
const search = document.getElementById("search");

// If there is no such key it will return null so short circuit it with empty array
let arrProducts = JSON.parse(localStorage.getItem("products")) || [];
let idCounter = JSON.parse(localStorage.getItem("id")) || 0;

// Loops through products array and converting the elements into corresponding html
const renderTable = (finalProducts = arrProducts) => {
  tableBody.innerHTML = finalProducts
    .map(
      (prod, idx) => `<tr class="align-baseline">
                <th scope="row">${idx + 1}</th>
                <td>${prod.name}</td>
                <td>${prod.price}</td>
                <td>${prod.cat}</td>
                <td>${prod.desc}</td>
                <td>
                  <div class="action d-flex justify-content-center gap-3">
                    <button data-action="update" data-id="${
                      prod.id
                    }" class="update btn p-2 rounded">Update <i class="icon-loop2"></i></button>
                    <button data-action="delete" data-id="${
                      prod.id
                    }" class="delete btn p-2 rounded">Delete <i class="icon-bin"></i></button>
                  </div>
                </td>
              </tr>`
    )
    .join("");
};

//initial Render for rendering the old values in local storage
renderTable();

const getData = () => {
  let product = {
    name: null,
    price: null,
    cat: null,
    desc: null,
    id: idCounter++,
  };
  let i = 0;
  for (const key in product) {
    if (key === "id") break;
    product[key] = inputs[i].value;
    i++;
  }
  return product;
};

const resetInput = () =>
  inputs.forEach(
    (elem) =>
      elem.classList.remove("is-invalid", "is-valid") || (elem.value = "")
  );

// ************ Create **************
const createProduct = () => {
  arrProducts = [...arrProducts, getData()];
  localStorage.setItem("products", JSON.stringify(arrProducts));
  localStorage.setItem("id", idCounter);
  renderTable();
  resetInput();
};
// ************ Create **************

// ************ Delete **************
const deleteProduct = (id) => {
  arrProducts = arrProducts.filter((prod) => prod.id != id);
  renderTable();
  localStorage.setItem("products", JSON.stringify(arrProducts));
};
// ************ Delete **************

// ************ Update **************
const prepareUpdate = (id) => {
  const product = arrProducts.find((prod) => prod.id == id);
  Object.keys(product).forEach((key, index) => {
    if (key !== "id") inputs[index].value = product[key];
  });
  form.dataset.action = "update";
  form.dataset.id = id;
  sub.innerHTML = `Update Product&nbsp;&nbsp;<i class="icon-loop2"></i>`;
  cancel.classList.remove("d-none");
};
const updateProduct = (id) => {
  const index = arrProducts.findIndex((prod) => prod.id == id);
  arrProducts[index] = getData();
  arrProducts[index].id = id;
  form.dataset.action = "add";
  form.dataset.id = null;
  sub.innerHTML = `Add Product&nbsp;&nbsp;<i class="icon-magic-wand"></i>`;
  localStorage.setItem("products", JSON.stringify(arrProducts));
  resetInput();
  renderTable();
};
const cancelUpdate = () => {
  resetInput();
  form.dataset.action = "add";
  form.dataset.id = null;
  sub.innerHTML = `Add Product&nbsp;&nbsp;<i class="icon-magic-wand"></i>`;
  cancel.classList.add("d-none");
};
// ************ Update **************

// ************ Search ***************
const handleSearch = (e) =>
  renderTable(
    arrProducts.filter((prod) =>
      Object.values(prod).some((val) =>
        String(val).toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  );

// ************ Search ***************

// Name Validation
const isValidName = () => {
  const isValid = /^[A-Z][\sa-zA-Z0-9]*$/.test(inputs[0].value);
  inputs[0].classList.toggle("is-valid", isValid);
  inputs[0].classList.toggle("is-invalid", !isValid);
  return isValid;
};

const isValidForm = () => {
  return isValidName();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!isValidForm()) return;

  if (form.dataset.action == "add") createProduct();
  else {
    updateProduct(Number(form.dataset.id));
  }
});

tableBody.addEventListener("click", (e) => {
  if (e.target.dataset.action == "update") {
    prepareUpdate(e.target.dataset.id);
  }
  if (e.target.dataset.action == "delete") {
    deleteProduct(e.target.dataset.id);
  }
});

search.addEventListener("input", (e) => {
  handleSearch(e);
});

inputs[0].addEventListener("input", (e) => {
  isValidName();
});

cancel.addEventListener("click", cancelUpdate);
