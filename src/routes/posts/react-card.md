---
title: "React.js Card"
date: 2021-02-17T19:27:04-05:00
tags:
    - programming
    - javascript
    - css
    - react
draft: false
---

I've been learning React so that I can build my web applications for others and
myself. React is component based. You create reusable components and render
them with data. Here I created a card component that lets me insert cards. They
can even contain other cards and are easy to understand from the App.js.

To create a new component I just create a new file called `Card.js` and import
it at the top of `App.js`.

```javascript
import Card from './Card.js';
```

Then inside `Card.js` I can create my Card. At the top I import my styles and
return the JSX Card object.

```javascript
import './Card.css';

function Card(props) {
  return (
    <div className="Card">
      <h2 className="CardTitle">{props.cardTitle}</h2>
      <p className="CardContent">{props.children}</p>
    </div>
  );
}

export default Card;
```

At the bottom I set the default export to Card so that we can import it
properly in `App.js`.

My styles are fairly simple, they just create a nice looking card.

```css
.Card {
  text-align: center;
  background-color: lightgrey;
  border: 1px solid grey;
  border-radius: 0.5em;
  margin: 1em;
  height: 20em;
  overflow: hidden;
}

.CardTitle {
  font-size: 1em;
}

.CardContent {
  background-color: white;
  height: 100%;
  border-radius: 0.5em;
  border-top-left-radius: 0em;
  border-top-right-radius: 0em;
  padding: 1em;
}
```

That's great but we still have to insert our card in App.js. Now that we've
created a component and imported it all I have to do in App.js to create a card
is this.

```jsx
<Card cardTitle="Example Card Title">
    Hello World
</Card>
```

Finally we can see that this builds a card.

![react card](/img/reactjs-card.png)

This can be used for building any kind of component, such as dialog boxes,
forms, or anything you can imagine in HTML/CSS.
