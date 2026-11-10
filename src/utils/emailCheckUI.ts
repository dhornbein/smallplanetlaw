/**
 * Browser-side behavior for the email typo warning used by our signup forms.
 *
 * Expects a warning box next to the email input containing
 * `.email-check-text` (filled in here) and `.email-check-note` (shown when the
 * warning stops a submit). The box starts hidden with the `hidden` class.
 */
import { checkEmail } from "./emailTypos";

export interface EmailCheckControl {
  /**
   * Call at the start of submit. Returns true if a warning was just shown,
   * meaning this submit should stop. The visitor can submit the same address
   * again to send it as typed.
   */
  blocksSubmit(): boolean;
  /** Clears the warning, e.g. after a successful signup */
  reset(): void;
}

export function attachEmailCheck(
  input: HTMLInputElement,
  box: HTMLElement,
  options: { suggestionClass?: string } = {},
): EmailCheckControl {
  const text = box.querySelector(".email-check-text");
  const note = box.querySelector(".email-check-note");

  // An address the visitor chose to keep after seeing the warning
  let keptEmail: string | null = null;
  // The address the visible warning is about
  let warnedEmail: string | null = null;

  const hide = () => {
    box.classList.add("hidden");
    note?.classList.add("hidden");
    warnedEmail = null;
  };

  /** Shows a warning for the current address. Returns true if one is showing. */
  const show = (isSubmitting: boolean): boolean => {
    const value = input.value.trim();

    // Leave a visible warning alone on blur. Rebuilding it would remove the
    // suggestion button mid-click, because pressing it blurs the input.
    if (!isSubmitting && value === warnedEmail) return true;

    const result = value && value !== keptEmail ? checkEmail(value) : null;
    if (!result || !text) {
      hide();
      return false;
    }

    text.replaceChildren();
    if (result.kind === "suggestion") {
      const useSuggestion = document.createElement("button");
      useSuggestion.type = "button";
      useSuggestion.className = `font-semibold underline cursor-pointer ${options.suggestionClass ?? ""}`;
      useSuggestion.textContent = result.suggestion;
      useSuggestion.addEventListener("click", () => {
        input.value = result.suggestion;
        hide();
        input.focus();
      });
      text.append("Did you mean ", useSuggestion, "?");
    } else {
      text.textContent = result.message;
    }

    note?.classList.toggle("hidden", !isSubmitting);
    box.classList.remove("hidden");
    warnedEmail = value;
    return true;
  };

  input.addEventListener("blur", () => show(false));
  input.addEventListener("input", hide);

  return {
    blocksSubmit() {
      if (!show(true)) return false;
      keptEmail = input.value.trim();
      input.focus();
      return true;
    },
    reset() {
      keptEmail = null;
      hide();
    },
  };
}
