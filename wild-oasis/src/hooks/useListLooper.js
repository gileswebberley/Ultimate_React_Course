import { useCallback, useEffect, useRef } from 'react';

/**
 * This takes care of using arrow keys to move through the list of generated suggestions as if it were a system autocomplete list
 * @returns {Object} refs to attach to the various components (inputFieldRef, optionBoxRef, and containerRef)
 * @example
 *<div ref={containerRef}>
      <input ref={inputFieldRef} autoComplete='new' value={inVal} onChange={(e)=> setInVal(e.target.value)}
        //...
        />
      {(condition) && (
        //we're having to connect the click outside ref to this as well as the optionBoxRef
        <div ref={(el) => {
            optionBoxRef.current = el;
            clickOutsideRef.current = el;
          }}
        >
          <ul>
            {data.map((item, i) => {
                return (
                    //child of the list items must be a focusable element and onSelect will want to set the inVal to this value and close the OptionBox
                  <li key={i}>
                    <button onClick={onSelect} value={item}>
                      {item}
                    </button>
                  </li>
                );
              })
          </ul>
        </div>
      )}
    </div>
 */
export function useListLooper() {
  //if you need other refs on an element too then simply do the ref={(el) => thisRef.current = el; otherRef.current = el;}
  const inputFieldRef = useRef(null);
  const optionBoxRef = useRef(null);
  const containerRef = useRef(null);
  const selectedChildRef = useRef(null);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.code === 'ArrowDown') {
        //check if we're focussed on the Input first...
        if (inputFieldRef.current === document.activeElement) {
          selectedChildRef.current =
            optionBoxRef.current?.firstChild?.firstChild;
          selectedChildRef.current?.firstChild?.focus();
          return;
        }
        //...and if not check if we're focussed on one of the Options
        if (selectedChildRef.current.firstChild === document.activeElement) {
          if (selectedChildRef.current.nextSibling) {
            selectedChildRef.current = selectedChildRef.current.nextSibling;
            selectedChildRef.current.firstChild.focus();
            return;
          } else {
            selectedChildRef.current = null;
            inputFieldRef.current.focus();
            return;
          }
        }
      }

      if (e.code === 'ArrowUp') {
        //check if we're focussed on the Input first...
        if (inputFieldRef.current === document.activeElement) {
          selectedChildRef.current =
            optionBoxRef.current?.firstChild?.lastChild;
          selectedChildRef.current?.firstChild?.focus();
          return;
        }
        //...and if not check if we're focussed on one of the Options
        if (selectedChildRef.current.firstChild === document.activeElement) {
          if (selectedChildRef.current.previousSibling) {
            selectedChildRef.current = selectedChildRef.current.previousSibling;
            selectedChildRef.current.firstChild.focus();
            return;
          } else {
            selectedChildRef.current = null;
            inputFieldRef.current.focus();
            return;
          }
        }
      }

      if (e.code === 'Enter') {
        selectedChildRef.current = null;
      }
    },
    [optionBoxRef]
  );

  //ok, let's make this thing work for the arrow buttons
  useEffect(() => {
    let listeningElement = null;
    if (containerRef.current !== null) {
      //console.log(`adding listener`);
      listeningElement = containerRef.current;
      listeningElement.addEventListener('keydown', handleKeyPress);
    }
    return () => {
      //console.log(`losing listener`);
      listeningElement?.removeEventListener('keydown', handleKeyPress);
    };
  }, [containerRef, handleKeyPress]);

  return { inputFieldRef, optionBoxRef, containerRef };
}
