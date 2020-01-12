![travis](https://travis-ci.com/sickdyd/react-dynamic-badge.svg?branch=master)

# React-Dynamic-Badge

![Alt text](/shot.gif?raw=true "Screenshot")

A responsive component that shows a badge if an array of strings overflows the parent element.

```js
<DynamicBadge
    items={[
        "Item 1",
        "Item 2",
        "Item 3",
        "Item 4",
    ]}
/>
```

#### Technical Documentation

- [React-Dynamic-Badge](#react-dynamic-badge)
      - [Technical Documentation](#technical-documentation)
    - [Installing](#installing)
    - [Exports](#exports)
  - [`<DynamicBadge>`](#dynamicbadge)
    - [DynamicBadge Usage](#dynamicbadge-usage)
      - [`<DynamicBadge>` Props:](#dynamicbadge-props)
    - [License](#license)

### Installing

```bash
$ npm install react-dynamic-badge
```

### Exports

The default export is `<DynamicBadge>`.
Here's how to use it:

```js

import { DynamicBadge } from 'react-dynamic-badge';

```

## `<DynamicBadge>`

A `<DynamicBadge>` element will calculate the width of the parent element and show only the items that can fit. If an item overflows it will be hidden and a badge will be shown. If there is only one item and it overflows ellipsis is used. The font is inherited from the containing element.

### DynamicBadge Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { DynamicBadge } from 'react-dynamic-badge';

class App extends React.Component {

  render() {
    return (
      <div style={{ width: "50%", border: "1px dashed" }}>
        <DynamicBadge
            items={[
                "Item 1",
                "Item 2",
                "Item 3",
                "Item 4",
            ]}
        />
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.body);
```

#### `<DynamicBadge>` Props:

| Name            | Type             | Required | Default      | Description                                                                                                           |
|-----------------|------------------|----------|--------------|-----------------------------------------------------------------------------------------------------------------------|
| badgeClass      | string           | no       | "bdg-badge"  | It's possible to use a custom class for the badge.                                                                    |
| items           | array of strings | **yes**  | []           | The items to be displayed. If not set, it falls back to an empty array (nothing is shown).                            |
| minWidth        | int              | no       |              | Sets the minimum width for the text to be shown; defaults at 1/2 characters depending on the font and character.      |
| onlyBadge       | bool             | no       | false        | If set to true it will display only the badge and no text.                                                            |
| resizeDebounce  | int              | no       | 1            | The debounce value for the resize event in ms. The smaller the value the quicker the badge will be updated on resize. |

### License

MIT
