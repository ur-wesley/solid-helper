import { createSignal, JSX, ParentComponent, splitProps } from "solid-js";

type FormState = {
  pending: boolean;
  success: boolean;
  error: Error | null;
  dirty: boolean;
  touched: boolean;
};

type FormProps = Omit<
  JSX.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onsubmit"
>;

/**
 * Creates a reactive form handler with state management for pending, success, error,
 * dirty, and touched states.
 *
 * @param {function(FormData): Promise<void>} processFormData - A function to process form data asynchronously.
 *
 * @returns {[() => FormState, { Form: ParentComponent<FormProps> }]}
 */
function createFormAction(
  processFormData: (formData: FormData) => Promise<void>,
): [() => FormState, { Form: ParentComponent<FormProps> }] {
  const [state, setState] = createSignal<FormState>({
    pending: false,
    success: false,
    error: null,
    dirty: false,
    touched: false,
  });

  function getFormData(form: HTMLFormElement): Record<string, any> {
    const formData = new FormData(form);
    const obj: Record<string, any> = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  let formElem: HTMLFormElement | null = null;
  // Store the initial snapshot as a JSON string.
  let initialSnapshot: string | null = null;

  const Form: ParentComponent<FormProps> = (props) => {
    const [localProps, nativeProps] = splitProps(props, ["children", "ref"]);

    function handleInput() {
      if (formElem) {
        const currentSnapshot = JSON.stringify(getFormData(formElem));
        setState((prev) => ({
          ...prev,
          dirty: currentSnapshot !== initialSnapshot,
        }));
      }
    }

    function handleBlur() {
      setState((prev) => ({ ...prev, touched: true }));
    }

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

        setState({
          pending: true,
          success: false,
          error: null,
          dirty: state().dirty,
          touched: state().touched,
        });

        const inputs = formElem.querySelectorAll("input");
        const inputError = Array.from(inputs).find(
          (input) => input.getAttribute("data-error") === "true",
        );
        if (!formElem.checkValidity() || inputError) {
          formElem.reportValidity();
          const formError = new Error("Form is not valid");
          setState((prev) => ({
            ...prev,
            pending: false,
            success: false,
            error: formError,
          }));
          return false;
        }

        await processFormData(formData);
        setState((prev) => ({
          ...prev,
          pending: false,
          success: true,
          error: null,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          pending: false,
          success: false,
          error: error,
        }));
      }
      return false;
    }

    return (
      <form
        role="form"
        ref={(el) => {
          formElem = el;
          if (formElem && initialSnapshot === null) {
            const data = getFormData(formElem);
            initialSnapshot = JSON.stringify(data);
          }
          if (typeof localProps.ref === "function") localProps.ref(el);
        }}
        onSubmit={submit}
        onkeydown={handleKeyDown}
        oninput={handleInput}
        onblur={handleBlur}
        {...nativeProps}
      >
        {localProps.children}
      </form>
    );
  };

  return [
    state,
    {
      Form,
    },
  ] as const;
}

export default createFormAction;
