# Solid Helper Library

This library is a collection of helper functions for SolidJS.

## Installation

```bash
npm install @ur-wesley/solid-helper
```

```bash
pnpm add @ur-wesley/solid-helper
```

```bash
bun add @ur-wesley/solid-helper
```

## Usage

### formAction

helper function to handle form submission

formState has the following properties:

- pending: boolean;
- success: boolean;
- error: Error | null;

```jsx
import { createFormAction } from "@ur-wesley/solid-helper";

const [formState, { Form }] = createFormAction(async (formData: FormData) => {
 // Process the form data here
 // Example: send the data to an API endpoint
 const id = formData.get("id") as string;
 const response = await fetch("/api/submit/" + id, {
  method: "POST",
  body: formData,
 });
 return response.json();
});

function MyFormComponent() {
 return (
  <div>
    <Form>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <button type="submit">Submit</button>
    </Form>
    {formState().pending && <p>Submitting...</p>}
    {formState().success && <p>Form submitted successfully!</p>}
    {formState().error && <p>Error: {formState().error.message}</p>}
  </div>
 );
}
```
