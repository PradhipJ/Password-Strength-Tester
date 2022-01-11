const strengthMeter = document.getElementById("strength-meter");
const passwordInput = document.getElementById("password-input");
const commentsContainer = document.getElementById("comments");

passwordInput.addEventListener("input", UpdateStrengthMeter);

function UpdateStrengthMeter() {
  const weaknesses = calculatePasswordStrength(passwordInput.value);
  let strength = 100;
  commentsContainer.innerHTML = "";
  weaknesses.forEach((weakness) => {
    if (weakness == null) return;
    strength -= weakness.deduction;
    const messageElement = document.createElement("div");
    messageElement.innerText = weakness.message;
    commentsContainer.appendChild(messageElement);
  });

  strengthMeter.style.setProperty("--strength", strength);
}

function calculatePasswordStrength(password) {
  const weaknesses = [];
  weaknesses.push(lengthWeakness(password));
  weaknesses.push(lowerCaseWeakness(password));
  weaknesses.push(upperCaseWeakness(password));
  weaknesses.push(numberWeakness(password));
  weaknesses.push(specialCharacterWeakness(password));
  weaknesses.push(repeatCharactersWeakness(password));
  return weaknesses;
}

function upperCaseWeakness(password) {
  return characterTypeWeakness(password, /[A-Z]/g, "uppercase characters");
}

function lowerCaseWeakness(password) {
  return characterTypeWeakness(password, /[a-z]/g, "lowercase characters");
}

function lengthWeakness(password) {
  const length = password.length;

  if (length <= 5) {
    return {
      message: "Your password is too short!",
      deduction: 40,
    };
  }

  if (length <= 10) {
    return {
      message: "Your password could be longer",
      deduction: 15,
    };
  }
}

function characterTypeWeakness(password, regex, type) {
  const matches = password.match(regex) || [];
  if (matches.length === 0) {
    return {
      message: `Your password has no ${type} `,
      deduction: 20,
    };
  }
  if (matches.length <= 2) {
    return {
      message: `Your password could use more ${type} `,
      deduction: 5,
    };
  }
}

function numberWeakness(password) {
  return characterTypeWeakness(password, /[0-9]/g, "numbers");
}

function specialCharacterWeakness(password) {
  return characterTypeWeakness(
    password,
    /[^0-9a-zA-Z\s]/g,
    "special characters"
  );
}

function repeatCharactersWeakness(password) {
  const matches = password.match(/(.)\1/g) || [];
  if (matches.length > 0) {
    return {
      message: "Your password has repeat characters",
      deduction: matches.length * 10,
    };
  }
}
