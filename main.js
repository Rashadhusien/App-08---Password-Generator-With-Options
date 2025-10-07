//-- Handle Range Input
const rangeInput = document.querySelector("#length");
const decreaseLength = document.querySelector("#decreaseLength");
const increaseLength = document.querySelector("#increaseLength");

const lengthValue = document.querySelector("#lengthValue");

const lengthValueStored =
  Number(JSON.parse(localStorage.getItem("rang-value"))) ||
  Number(lengthValue.textContent);

updateLengthValue(lengthValueStored);
checkLengthButtons(lengthValueStored);

rangeInput.addEventListener("input", (e) => {
  updateLengthValue(e.target.value);
});

function updateLengthValue(value) {
  localStorage.setItem("rang-value", value);
  lengthValue.textContent = value;
  rangeInput.value = value;
}

increaseLength.addEventListener("click", () => {
  const newValue = Number(lengthValue.textContent) + 1;
  updateLengthValue(newValue);
  checkLengthButtons(newValue);
});
decreaseLength.addEventListener("click", () => {
  const newValue = Number(lengthValue.textContent) - 1;
  updateLengthValue(newValue);
  checkLengthButtons(newValue);
});

function checkLengthButtons(value) {
  if (value === Number(rangeInput.max)) {
    increaseLength.disabled = true;
    decreaseLength.disabled = false;
    return;
  }
  if (value === Number(rangeInput.min)) {
    decreaseLength.disabled = true;
    increaseLength.disabled = false;
    return;
  }
  decreaseLength.disabled = false;
  increaseLength.disabled = false;
}
