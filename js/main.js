const inputs = document.querySelectorAll("input");
const tableBody = document.querySelector("tbody");
let arrProducts = [];

// Loops through products array and converting the elements into corresponding html
const renderTable = () => {
  tableBody.innerHTML = "";
  console.log(arrProducts);
  arrProducts.forEach((prod, idx) => {
    const newRow = `<tr class="align-baseline">
                <th scope="row">${idx + 1}</th>
                <td>${prod.name}</td>
                <td>${prod.price}</td>
                <td>${prod.cat}</td>
                <td>${prod.desc}</td>
                <td>
                  <div class="action d-flex justify-content-center gap-3">
                    <button data-action="update" data-idx="${idx}" class="update btn p-2 rounded">Update</button>
                    <button data-action="delete" data-idx="${idx}" class="delete btn p-2 rounded">Delete</button>
                  </div>
                </td>
              </tr>`;
    tableBody.innerHTML += newRow;
    return prod;
  });
};

const getData = () => {
  let product = {
    name: null,
    price: null,
    cat: null,
    desc: null,
  };
  let i = 0;

  for (const key in product) {
    product[key] = inputs[i].value;
    i++;
  }
  return product;
};

const createProduct = () => {
  arrProducts = [...arrProducts, getData()];
  renderTable();

  // Reset Input
  inputs.forEach((elem) => (elem.value = ""));
};
const deleteProduct = (idx) => {
  arrProducts = arrProducts.filter((_, i) => i != idx);
  renderTable();
};
const updateProduct = (idx) => {
  let i = 0;
  for (const key in arrProducts[i]) {
    inputs[i].value = arrProducts[idx][key];
    i++;
  }
  renderTable();
};

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  createProduct();
});

tableBody.addEventListener("click", (e) => {
  if (e.target.dataset.action == "update") {
    updateProduct(e.target.dataset.idx);
  }
  if (e.target.dataset.action == "delete") {
    deleteProduct(e.target.dataset.idx);
  }
});
