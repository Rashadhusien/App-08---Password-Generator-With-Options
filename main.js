//-- Handle Range Input
const rangeInput = document.querySelector("#length");
const decreaseLength = document.querySelector("#decreaseLength");
const increaseLength = document.querySelector("#increaseLength");

const lengthValue = document.querySelector("#lengthValue");

const lengthValueStored =
  Number(JSON.parse(localStorage.getItem("rang-value"))) ||
  Number(lengthValue.textContent);

const options = JSON.parse(localStorage.getItem("options")) || {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

const passwords = JSON.parse(localStorage.getItem("passwords")) || [];

updateLengthValue(lengthValueStored);
checkLengthButtons(lengthValueStored);
renderPasswords();

rangeInput.addEventListener("input", (e) => {
  updateLengthValue(e.target.value);
});

function updateLengthValue(value) {
  const min = Number(rangeInput.min);
  const max = Number(rangeInput.max);
  const clamped = Math.max(min, Math.min(max, value));
  localStorage.setItem("rang-value", clamped);
  lengthValue.textContent = clamped;
  rangeInput.value = clamped;
  checkLengthButtons(clamped);
}

function changeLength(delta) {
  const newValue = Number(lengthValue.textContent) + delta;
  updateLengthValue(newValue);
  checkLengthButtons(newValue);
}

increaseLength.addEventListener("click", () => changeLength(1));
decreaseLength.addEventListener("click", () => changeLength(-1));

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

const optionsInputs = document.querySelectorAll(`input[type="checkbox"]`);

optionsInputs.forEach((input) => {
  input.checked = options[input.id];
  input.addEventListener("click", () => {
    options[input.id] = input.checked;
    localStorage.setItem("options", JSON.stringify(options));
    checkGenerateButton();
  });
});

function checkGenerateButton() {
  const hasAnyOption = Object.values(options).some((value) => value === true);
  generateButton.disabled = !hasAnyOption;
}

const generateButton = document.querySelector("#generate");
checkGenerateButton();

generateButton.addEventListener("click", () => {
  generatePassword(Number(rangeInput.value), options);
});

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~{}[]:;<>,.?/",
};

function generatePassword(length, options) {
  let pool = "";
  Object.keys(options).map((option) => {
    if (options[option]) {
      pool += CHAR_SETS[option];
    }
  });

  if (pool.length === 0) {
    return;
  }

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    password += pool[randomIndex];
  }

  passwords.unshift(password);
  if (passwords.length > 10) passwords.splice(10);

  localStorage.setItem("passwords", JSON.stringify(passwords));
  renderPasswords();
}

function renderPasswords() {
  const passwordsContainer = document.querySelector(".passwords-grid");

  passwordsContainer.innerHTML = "";
  passwords.forEach((password, i) => {
    const passwordItem = document.createElement("div");
    passwordItem.classList.add("password-item");
    if (i === 0) {
      passwordItem.classList.add("password-new");
    }

    passwordItem.id = `password-${i}`;
    const content = `
            <span class="password-text"
              >${password}</span
            >
            <button class="btn-copy" data-index="${i}" onClick='copyText(${i})'>Copy</button>
          `;
    passwordItem.innerHTML = content;

    passwordsContainer.appendChild(passwordItem);
  });
}

function copyText(index) {
  navigator.clipboard.writeText(passwords[index]).then(() => {
    showToast();
  });
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
