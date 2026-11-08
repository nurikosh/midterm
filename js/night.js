// Stargazing Night page: sign-up form checks and the questions accordion.

const form = document.getElementById("signup-form");

// One rule for each field. It gets the value and returns the error text,
// or "" when the value is correct.
const rules = {
  name: function (value) {
    if (value === "") return "Please write your name.";
    if (value.length < 2) return "The name must have at least 2 letters.";
    if (!/^[\p{L}\s-]+$/u.test(value)) return "Use only letters in your name.";   // \p{L} = any letter
    return "";
  },

  email: function (value) {
    if (value === "") return "Please write your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Write the email like aigerim@mail.com.";
    return "";
  },

  phone: function (value) {
    if (value === "") return "Please write your phone number.";
    const digits = value.replace(/[\s()-]/g, "");      // remove spaces, brackets and dashes
    if (!/^\+7\d{10}$/.test(digits)) return "Write the phone like +7 701 123 45 67.";
    return "";
  },

  date: function (value) {
    if (value === "") return "Please choose a Saturday.";
    return "";
  },

  people: function (value) {
    if (value === "") return "Please write how many people are coming.";
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > 5) return "You can sign up from 1 to 5 people.";
    return "";
  },

  message: function (value) {
    if (value.length > 200) return "Please make it shorter: " + value.length + " of 200 characters.";
    return "";
  }
};

// checks one field and shows or hides its error under it
function checkField(id) {
  const input = document.getElementById(id);
  const error = rules[id](input.value.trim());

  document.getElementById(id + "-error").textContent = error;
  input.classList.toggle("is-invalid", error !== "");
  return error === "";
}

// while typing: if a field shows an error, check it again,
// so the error disappears as soon as the value is correct
for (const id in rules) {
  const input = document.getElementById(id);
  input.addEventListener("input", function () {
    if (input.classList.contains("is-invalid")) checkField(id);
  });
  input.addEventListener("change", function () {
    if (input.classList.contains("is-invalid")) checkField(id);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();          // no page reload

  let allCorrect = true;
  for (const id in rules) {
    if (!checkField(id)) allCorrect = false;
  }

  if (!allCorrect) {
    form.querySelector(".is-invalid").focus();   // go to the first wrong field
    $("#success").stop(true, true).hide();
    return;
  }

  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const email = document.getElementById("email").value.trim();
  const people = Number(document.getElementById("people").value);
  const peopleText = people === 1 ? "1 person" : people + " people";

  $("#success-text").text("Thank you, " + name + "! We saved " + peopleText + " for the night of " +
    date + ". We will send the details to " + email + ".");
  $("#success").stop(true, true).hide().slideDown(400);

  form.reset();
});


// Accordion: a click opens or closes the answer under the question
$(".faq-question").on("click", function () {
  const answer = $(this).closest(".faq-item").find(".faq-answer");
  const isOpen = $(this).attr("aria-expanded") === "true";

  $(this).attr("aria-expanded", String(!isOpen));
  answer.stop(true, true).slideToggle(250);    // stop() so fast clicks do not pile up
});
