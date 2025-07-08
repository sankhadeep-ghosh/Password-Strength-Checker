const COMMON_PASSWORDS = new Set([
  "123456", "password", "12345678", "qwerty", "abc123", "111111",
  "123123", "password1", "admin", "letmein", "welcome", "iloveyou", "monkey"
]);

function calculateEntropy(password) {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/\d/.test(password)) pool += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) pool += 32;
  return password.length * Math.log2(pool || 1);
}

function strengthScore(password) {
  let reasons = [];
  let score = 0;

  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  else reasons.push("Too short (min 8 characters)");

  if (/[a-z]/.test(password)) score += 1;
  else reasons.push("Missing lowercase letters");

  if (/[A-Z]/.test(password)) score += 1;
  else reasons.push("Missing uppercase letters");

  if (/\d/.test(password)) score += 1;
  else reasons.push("Missing digits");

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else reasons.push("Missing special characters");

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    reasons.push("Password is too common");
    score = 0;
  }

  if (calculateEntropy(password) < 28) {
    reasons.push("Very low entropy");
  }

  let label = "Weak";
  if (score >= 6) label = "Strong";
  else if (score >= 3) label = "Medium";

  return { strength: label, reasons };
}

function checkStrength() {
  const pw = document.getElementById("pw-input").value;
  const result = strengthScore(pw);

  const resultElem = document.getElementById("strength-result");
  resultElem.innerText = `Strength: ${result.strength}`;

  // Remove any existing class before assigning the new one
  resultElem.className = '';
  resultElem.classList.add(result.strength.toLowerCase());

  const reasonsList = result.reasons.map(reason => `<li>${reason}</li>`).join('');
  document.getElementById("reasons").innerHTML = `<ul>${reasonsList}</ul>`;
}


function generatePassword() {
  const length = parseInt(document.getElementById("gen-length").value) || 12;
  const includeUpper = document.getElementById("upper").checked;
  const includeDigits = document.getElementById("digits").checked;
  const includeSymbols = document.getElementById("symbols").checked;

  let charset = "abcdefghijklmnopqrstuvwxyz";
  if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeDigits) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*(),.?\":{}|<>";

  if (charset.length === 0) {
    alert("Please select at least one character type.");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  document.getElementById("generated-password").innerText = `Generated: ${password}`;
}
