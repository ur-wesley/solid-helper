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

function createFormAction(
 processFormData: (formData: FormData) => Promise<any>
) {
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
     (input) => input.getAttribute("data-error") === "true"
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
