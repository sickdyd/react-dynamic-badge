/**
 * This component will trim an array according to the available space in its
 * parent element and if needed add a badge representing the number of hidden items
 * 
 * @param {Array} props.items Contains an array with all the items to be shown
 * @param {string} [props.badgeClass] If needed, the user can give a custom class to be used to represent the badges, if not provided use default class
 * @param {int} [props.resizeDebounce] Its the value that represents the ms used to debounce the resize event, default 1ms
 * 
 */

import React from 'react';

import './styles/default.css';

import ResizeObserver from 'resize-observer-polyfill';

export default function Badger(props) {

  // This ref is used to access the width and the fontSize of the container
  const refContainer = React.useRef(null);

  // Contains the jsx output to be rendered
  const [output, setOutput] = React.useState(null);

  // Used to trigger rerenders on window resize
  const [containerWidth, setContainerWidth] = React.useState();

  /**
   * @function getElementContentWidth It returns an int containing the element width
   * @param {DOM Element} element The element used to get the width
   */

  function getElementContentWidth(element) {

    let styles = window.getComputedStyle(element);
    let padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);

    return element.clientWidth - padding;
  }

  /**
   * @function getElementFontSize Returns a string containing the element font size
   * @param {DOM Element} element The element used to retrieve the fontSize
   */

  function getElementFontSize(element) {

    let styles = window.getComputedStyle(element);
    return styles.fontSize;
  }

  React.useEffect(()=>{

    const resizeDebounce = props.resizeDebounce ? props.resizeDebounce : 1;

    // Used to debounce the resize event
    function debounce(fn, ms) {

      let timer
      return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
          timer = null
          fn.apply(this, arguments)
        }, ms)
      };
    }

    // Called everytime the the parent element changes size
    // Put a delay between updates of X
    const debouncedHandleResize = debounce( function handleResize() {

      let rulerSpan = document.querySelector(".bdgr-ruler-span");

      if (rulerSpan) rulerSpan.style.fontSize = getElementFontSize( refContainer.current.parentNode )

      if ( refContainer.current ) {
        setContainerWidth( getElementContentWidth( refContainer.current.parentNode ));
      }
    }, resizeDebounce)

    const resizeObserver = new ResizeObserver( ()=> debouncedHandleResize() );

    resizeObserver.observe( refContainer.current.parentNode );

    return ()=>{
      resizeObserver.disconnect();
    }

  }, [ props.resizeDebounce ]);

  React.useLayoutEffect(()=>{

    let rulerSpan = document.querySelector(".bdgr-ruler-span");
    let rulerBadge = document.querySelector(".bdgr-ruler-badge");

    /**
     * If they don't exist, create the rulers used to calculate the pixel length of the items and badge
     */

    if (rulerSpan === undefined || rulerBadge === undefined || rulerSpan === null || rulerBadge === null) {

      rulerSpan = document.createElement("span");
      rulerSpan.classList.add("bdgr-ruler-span");
      rulerSpan.classList.add("bdgr-phantom");
      rulerSpan.style.fontSize = getElementFontSize( refContainer.current.parentNode );
      document.body.appendChild( rulerSpan );
  
      rulerBadge = document.createElement("div");
      rulerBadge.classList.add("bdgr-ruler-badge");
      rulerBadge.classList.add("bdgr-phantom");
      // It is possible to pass a custom class for the badge
      // by default use the basic badge
      if (props.badgeClass) {
        rulerBadge.classList.add( props.badgeClass );
      } else {
        rulerBadge.classList.add("bdgr-badge");
      }
      
      document.body.appendChild( rulerBadge );
    }

    // Store the container width of the parent element containing the items and badge
    const containerW = getElementContentWidth( refContainer.current.parentNode );

    // If the props items is present create 2 new arrays
    // One will be used to iterate and the other to pop items that can't fit
    let items = props.items ?  Array.from( props.items ) : [];
    let popItems = props.items ?  Array.from( props.items ) : [];
    let badgeCounter = 0;
    let badgeWidth = rulerBadge.offsetWidth;

    // If the items is only one, no need for badges
    if ( items.length > 1 ) {

      items.forEach( ()=> {

        // Set a bool to check if it's the last item
        let isLastItem = ( popItems[ popItems.length - 1 ]  === items[ items.length -1 ] );

        // Join all items in a comma separated string
        let textToCheck = popItems.join(", ");

        if ( isLastItem ) {
          // If it's the last item, check if it can fit, but also
          // remove the space required for the badge, that won't be
          // shown since it's the last item
          rulerSpan.innerHTML = textToCheck;
          badgeWidth = 0;
        } else {
          // If it's not the last item, consider badge width
          // and add , .... to the string to check
          // (the extra dot is to give a bit of room before making the item disappear)
          rulerSpan.innerHTML = textToCheck + ", .....";
          badgeWidth = rulerBadge.offsetWidth;
        }

        // If the text to be shown is larger that the container
        if ( rulerSpan.offsetWidth > ( containerW - badgeWidth )) {

          // If it's not the last item
          if ( popItems.length > 1 ) {
            // Remove the last item
            popItems.pop();
            // Increase the number shown in the badge
            badgeCounter++;
          }
        }

      });

    }

    // Join all items that will be visible (if needed the extra dots will be added by the css rule text-overflow: ellipsis in bdgr-ellipsis)
    const itemsToDisplay = popItems.join(", ");

    setOutput(
      <div style={{ width: "100%" }}>
        {badgeCounter > 0 ?
            <div className="bdgr-container">
              <div className="bdgr-ellipsis">{ itemsToDisplay }, ...</div>
              <div className={ props.badgeClass ? props.badgeClass : "bdgr-badge" } title={ props.items.join(", ") }>{ badgeCounter }</div>
            </div>
          :
            <div style={{ width: "100%" }}>{ itemsToDisplay }</div>}
      </div>)
    
  }, [ containerWidth, props.badgeClass, props.items, props.spanClass ]);

  return <div ref={refContainer}>{ output }</div>

}