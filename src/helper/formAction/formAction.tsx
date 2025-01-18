import { createSignal, JSX, ParentComponent, splitProps } from "solid-js";

type FormState = {
  pending: boolean;
  success: boolean;
  error: Error | null;
};

type FormProps = Omit<
  JSX.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onsubmit"
>;

/**
 * Creates a reactive form handler with state management for pending, success, and error states.
 *
 * @param {function<T = any>(FormData): Promise<T>} processFormData - A function to process form data asynchronously.
 *
 * @returns {[() => FormState, { Form: ParentComponent<FormProps> }]}
 *          A tuple containing:
 *          - `state`: A signal function returning the form state.
 *          - `Form`: A component for rendering the form with built-in submission handling.
 *
 * @example
 * const [state, { Form }] = createFormAction(async (formData) => {
 *   await fetch("/api/submit", { method: "POST", body: formData });
 * });
 *
 * <Form>
 *   <input type="text" name="username" required />
 *   <button type="submit">Submit</button>
 * </Form>
 *
 * console.log(state().pending); // Access form state
 */
function createFormAction(
  processFormData: <T = any>(formData: FormData) => Promise<T>,
): [() => FormState, { Form: ParentComponent<FormProps> }] {
  const [state, setState] = createSignal<FormState>({
    pending: false,
    success: false,
    error: null,
  });

  const Form: ParentComponent<FormProps> = (props) => {
    const [localProps, nativeProps] = splitProps(props, ["children", "ref"]);
    let formElem: HTMLFormElement | null = null;

    async function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        const isInputField = (event.target as HTMLElement).tagName === "INPUT";
        if (isInputField) {
          event.preventDefault();
          event.stopPropagation();
          await submit(event as unknown as SubmitEvent);
        }
      }
    }

    async function submit(event: SubmitEvent) {
      event.preventDefault();
      try {
        if (!formElem) return new Error("form element not found");
        const formData = new FormData(formElem);

        setState({ pending: true, success: false, error: null });

        const inputs = formElem.querySelectorAll("input");
        const inputError = Array.from(inputs).find(
          (input) => input.getAttribute("data-error") === "true",
        );
        if (!formElem.checkValidity() || inputError) {
          formElem.reportValidity();
          const formError = new Error("Form is not valid");
          setState({ pending: false, success: false, error: formError });
          return false;
        }

        await processFormData(formData);
        setState({ pending: false, success: true, error: null });
      } catch (error: any) {
        setState({ pending: false, success: false, error: error });
      }
      return false;
    }

    return (
      <form
        role="form"
        ref={formElem!}
        onSubmit={submit}
        onkeydown={handleKeyDown}
        {...nativeProps}
      >
        {localProps.children}
      </form>
    );
  };

  return [
    state!,
    {
      Form: Form!,
    },
  ] as const;
}

export default createFormAction;
