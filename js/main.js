"use strict";

const inputs = document.querySelectorAll("input");
const tableBody = document.querySelector("tbody");
const form = document.getElementById("form");
const sub = document.getElementById("sub");
const search = document.getElementById("search");

// If there is no such key it will return null so short circuit it with empty array
let arrProducts = JSON.parse(localStorage.getItem("products")) || [];
let idCounter = JSON.parse(localStorage.getItem("id")) || 0;

// Loops through products array and converting the elements into corresponding html
const renderTable = (filteredProducts = arrProducts) => {
  tableBody.innerHTML = "";
  filteredProducts.forEach((prod, idx) => {
    const newRow = `<tr class="align-baseline">
                <th scope="row">${idx + 1}</th>
                <td>${prod.name}</td>
                <td>${prod.price}</td>
                <td>${prod.cat}</td>
                <td>${prod.desc}</td>
                <td>
                  <div class="action d-flex justify-content-center gap-3">
                    <button data-action="update" data-id="${
                      prod.id
                    }" class="update btn p-2 rounded">Update &nbsp;&nbsp;<i class="icon-loop2"></i></button>
                    <button data-action="delete" data-id="${
                      prod.id
                    }" class="delete btn p-2 rounded">Delete &nbsp;&nbsp;<i class="icon-bin"></i></button>
                  </div>
                </td>
              </tr>`;
    tableBody.innerHTML += newRow;
  });
};

//initial Render for rendering the old values in local storage
renderTable();

const getData = () => {
  let product = {
    name: null,
    price: null,
    cat: null,
    desc: null,
    id: null,
  };
  let i = 0;
  for (const key in product) {
    product[key] = inputs[i].value;
    i++;
  }
  return product;
};

const resetInput = () => {
  inputs.forEach((elem) => (elem.value = ""));
};

// ************ Create **************
const createProduct = () => {
  arrProducts = [...arrProducts, getData()];
  arrProducts.at(-1).id = idCounter++;
  localStorage.setItem("id", idCounter);
  renderTable();
  resetInput();
  localStorage.setItem("products", JSON.stringify(arrProducts));
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
  let i = 0;
  for (const key in arrProducts[id]) {
    inputs[i].value = arrProducts[id][key];
    i++;
  }
  form.dataset.action = "update";
  form.dataset.id = id;
  sub.innerHTML = `Add Product&nbsp;&nbsp;<i class="icon-loop2"></i>`;
};
const updateProduct = (id) => {
  arrProducts[id] = getData();
  renderTable();
  form.dataset.action = "add";
  form.dataset.id = null;
  sub.innerHTML = `Add Product&nbsp;&nbsp;<i class="icon-magic-wand"></i>`;
  resetInput();
  localStorage.setItem("products", JSON.stringify(arrProducts));
};
// ************ Update **************

// ************ Search ***************
const handleSearch = (e) => {
  console.log(e);
  const query = e.target.value.toLowerCase();
  const filteredProducts = arrProducts.filter(
    (prod) =>
      prod.name.toLowerCase().includes(query) ||
      prod.price.toLowerCase().includes(query) ||
      prod.cat.toLowerCase().includes(query) ||
      prod.desc.toLowerCase().includes(query)
  );
  renderTable(filteredProducts); // Render the filtered results
};
// ************ Search ***************

// Name Validation
const isValidName = () => {
  const reg = /^[A-Z][\sa-zA-Z0-9]*$/;
  if (reg.test(inputs[0].value)) {
    inputs[0].classList.add("is-valid");
    inputs[0].classList.remove("is-invalid");
  } else {
    inputs[0].classList.remove("is-valid");
    inputs[0].classList.add("is-invalid");
  }
  return reg.test(inputs[0].value);
};

const isVlaidForm = () => {
  return isValidName();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!isVlaidForm()) return;

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
