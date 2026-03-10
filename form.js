/* =========================================================
   CONTACT FORM — SUPABASE INTEGRATION
   Requiere: @supabase/supabase-js
   Agregar en el <head> antes de este script:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
========================================================= */

/* ─── CONFIG ─────────────────────────────────────────── */
const SUPABASE_URL  = "https://aewgojhoszzcbcjzarvm.supabase.co";   // ← tu URL
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFld2dvamhvc3p6Y2JjanphcnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDQ2MjAsImV4cCI6MjA4ODY4MDYyMH0.l3o_hYATusjOe1wv84f-TMMuDq73zdj1aqogxZ5WakI";                    // ← tu anon key
const TABLE_NAME    = "contact_submissions";                 // ← nombre de tu tabla

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ─── DOM REFS ───────────────────────────────────────── */
const form        = document.querySelector(".contact-form");
const submitBtn   = form.querySelector(".btn-premium");
const nameInput   = form.querySelector('input[type="text"]');
const emailInput  = form.querySelector('input[type="email"]');
const companyInput= form.querySelectorAll('input[type="text"]')[1];
const phoneInputEl= document.querySelector("#phone-input");
const selectValue = form.querySelector(".custom-select-value");
const textarea    = form.querySelector("textarea");

/* ─── HELPERS ────────────────────────────────────────── */

/** Muestra error visual en un input-group */
function setError(input, message) {
  const group = input.closest(".input-group") || input.closest(".phone-group");
  if (!group) return;
  group.classList.add("has-error");
  group.classList.remove("has-success");

  let hint = group.querySelector(".field-hint");
  if (!hint) {
    hint = document.createElement("span");
    hint.className = "field-hint";
    group.appendChild(hint);
  }
  hint.textContent = message;
}

/** Marca un campo como válido */
function setSuccess(input) {
  const group = input.closest(".input-group") || input.closest(".phone-group");
  if (!group) return;
  group.classList.remove("has-error");
  group.classList.add("has-success");

  const hint = group.querySelector(".field-hint");
  if (hint) hint.textContent = "";
}

/** Limpia todos los estados */
function clearStates() {
  form.querySelectorAll(".input-group, .phone-group").forEach(g => {
    g.classList.remove("has-error", "has-success");
    const hint = g.querySelector(".field-hint");
    if (hint) hint.textContent = "";
  });
}

/** Estado del botón */
function setBtnState(state) {
  const states = {
    idle:    { text: submitBtn.dataset.en || "Send message", disabled: false, cls: ""         },
    loading: { text: "Sending...",                           disabled: true,  cls: "loading"   },
    success: { text: "Message sent ✓",                      disabled: true,  cls: "success"   },
    error:   { text: "Try again",                            disabled: false, cls: "btn-error" },
  };
  const s = states[state];
  submitBtn.textContent = s.text;
  submitBtn.disabled    = s.disabled;
  submitBtn.className   = "btn-premium " + s.cls;
}

/** Valida email */
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

/** Valida teléfono con intl-tel-input (si está inicializado) */
function isValidPhone(val) {
  if (!val) return true; // opcional
  if (window.iti) return window.iti.isValidNumber();
  return true;
}

/* ─── VALIDACIÓN EN TIEMPO REAL ──────────────────────── */

nameInput.addEventListener("blur", () => {
  if (!nameInput.value.trim()) {
    setError(nameInput, "Name is required.");
  } else {
    setSuccess(nameInput);
  }
});

emailInput.addEventListener("blur", () => {
  if (!emailInput.value.trim()) {
    setError(emailInput, "Email is required.");
  } else if (!isValidEmail(emailInput.value)) {
    setError(emailInput, "Enter a valid email.");
  } else {
    setSuccess(emailInput);
  }
});

phoneInputEl.addEventListener("blur", () => {
  const val = phoneInputEl.value.trim();
  if (val && !isValidPhone(val)) {
    setError(phoneInputEl, "Enter a valid phone number.");
  } else if (val) {
    setSuccess(phoneInputEl);
  }
});

textarea.addEventListener("blur", () => {
  if (!textarea.value.trim()) {
    setError(textarea, "Please describe your project.");
  } else {
    setSuccess(textarea);
  }
});

/* ─── VALIDACIÓN COMPLETA ────────────────────────────── */

function validateAll() {
  let valid = true;

  if (!nameInput.value.trim()) {
    setError(nameInput, "Name is required.");
    valid = false;
  } else {
    setSuccess(nameInput);
  }

  if (!emailInput.value.trim()) {
    setError(emailInput, "Email is required.");
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    setError(emailInput, "Enter a valid email.");
    valid = false;
  } else {
    setSuccess(emailInput);
  }

  const phoneVal = phoneInputEl.value.trim();
  if (phoneVal && !isValidPhone(phoneVal)) {
    setError(phoneInputEl, "Enter a valid phone number.");
    valid = false;
  }

  if (!selectValue.value) {
    const group = selectValue.closest(".custom-select-group");
    group.classList.add("has-error");
    let hint = group.querySelector(".field-hint");
    if (!hint) {
      hint = document.createElement("span");
      hint.className = "field-hint";
      group.appendChild(hint);
    }
    hint.textContent = "Please select a project type.";
    valid = false;
  } else {
    const group = selectValue.closest(".custom-select-group");
    group.classList.remove("has-error");
    group.classList.add("has-success");
    const hint = group.querySelector(".field-hint");
    if (hint) hint.textContent = "";
  }

  if (!textarea.value.trim()) {
    setError(textarea, "Please describe your project.");
    valid = false;
  } else {
    setSuccess(textarea);
  }

  return valid;
}

/* ─── SUBMIT ─────────────────────────────────────────── */

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearStates();

  if (!validateAll()) return;

  setBtnState("loading");

  const payload = {
    name:         nameInput.value.trim(),
    email:        emailInput.value.trim(),
    company:      companyInput?.value.trim() || null,
    phone:        window.iti
                    ? window.iti.getNumber()        // formato E.164: +573001234567
                    : phoneInputEl.value.trim() || null,
    project_type: selectValue.value,
    message:      textarea.value.trim(),
    created_at:   new Date().toISOString(),
  };

  try {
    const { error } = await db.from(TABLE_NAME).insert([payload]);

    if (error) throw error;

    setBtnState("success");
    form.reset();
    clearStates();

    // Reset custom select
    const selectText = form.querySelector(".custom-select__text");
    if (selectText) {
      selectText.textContent = selectText.dataset.en || "Project type";
      selectText.classList.remove("selected");
    }
    form.querySelectorAll(".custom-select__option.active")
        .forEach(o => o.classList.remove("active"));
    selectValue.value = "";

    // Reset intl-tel-input
    if (window.iti) window.iti.setNumber("");

    // Vuelve al estado idle después de 4s
    setTimeout(() => setBtnState("idle"), 4000);

  } catch (err) {
    console.error("Supabase error:", err);
    setBtnState("error");
    setTimeout(() => setBtnState("idle"), 3000);
  }
});