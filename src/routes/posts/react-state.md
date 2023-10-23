---
title: "Managing State in React"
date: 2021-09-04T16:31:25-04:00
tags:
    - programming
    - javascript
    - react
draft: false
---

In React when we want to manage individual state there is a function we can
import called `useState` that gives us a getter and setter letting React know
when it needs to re-render.

```typescript
import React, { useState } from 'react';

const myComponent = () => {
  const [count, setCount] = 0;
  ...
}
```

This initializes count as a state variable that can be accessed with `count`
and set with `setCount`.

If we wanted to write a function that incremented count, we could add a button.

```typescript
...
return (
    <>
      <p>Count is: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </>
);
```

Here we wrapped our text and button in a [React
Fragment](https://reactjs.org/docs/fragments.html). Since components can only
return one DOM parent element, Fragments allow us to return more than one
without creating more divs in our markup.

Then I set the `onClick` for button to an inline function that increases count
by 1 using `setCount`. If we were to do this without a state variable, i.e.
`const count = 0` React wouldn't know when to re-render our data.

This can be used to hold any state or object however, not just numbers and
strings. If we wanted to instead append to a list we might write a function
that gets passed to the `onSubmit` of a form.

```typescript
...
[list, setList] = useState([]);
...

const onFormSubmit(event) {
  event.preventDefault();
  list.push(form.name);
  setList(list);
}
```

Changing all our input `onChange` methods as well to update the state of `form`
when the data changes.

```typescript
...
<label>
  <p className={"text-label"}>Name:</p>
  <input
    onChange={handleSetForm}
    type="text"
    name="name"
  />
</label>
...
```

```typescript
...
[form, setForm] = useState({ name: '' });
...

const handleSetForm = ({ target: { name, value } }: any) => {
  setForm((form) => ({ ...form, [name]: value }));
};
```

This updates our form state whenever the data changes. Allowing us to use
`form` to append to our list above whenever the submit button is clicked.
