import React, { useRef, useState, useContext, useEffect } from "react";
import { ElementContext } from "../context/ElementContext";
import { InnerText } from "./nested-components/InnerText.js";
import { AddStyle } from "./nested-components/AddStyle.js";
import { AddLink } from "./nested-components/AddLink.js";

export const CreateElement = () => {
  const [text, setText] = useState(""); //To store text from textarea fields
  const [element, setElement] = useState(""); //To store created element
  const [styledElement, setStyledElement] = useState(""); //To store styled element
  const [link, setLink] = useState(""); //To store link
  const [next, setNext] = useState(""); //To set next element to render

  //Reference variables used to check if element is a link
  const isLink = useRef();

  //Reference variables for the radio buttons in addStyle
  const normal = useRef();
  const bold = useRef();
  const italic = useRef();
  const strikethrough = useRef();
  const underline = useRef();
  const subscript = useRef();
  const superscript = useRef();

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  //Using Context API to set global state variable 'finalElement' to use in GeneratedElement component
  const { setFinalElement } = useContext(ElementContext);

  //Called when innerText is set
  const setElementText = () => {
    setElement(text);
    setText("");
    const nextStep = isLink.current.checked ? "Add Link" : "Add Style";
    setNext(nextStep);
  };

  //Called when a link is set
  const setElementLink = () => {
    setLink(text);
    setText("");
    setNext("Add Style");
  };

  //Called when a style is selected
  const setElementStyle = () => {
    const text = element;
    let newElement = ``;
    if (bold.current.checked) {
      newElement = `<b>${text}</b>`;
    } else if (italic.current.checked) {
      newElement = `<i>${text}</i>`;
    } else if (underline.current.checked) {
      newElement = `<ins>${text}</ins>`;
    } else if (strikethrough.current.checked) {
      newElement = `<del>${text}</del>`;
    } else if (subscript.current.checked) {
      newElement = `<sub>${text}</sub>`;
    } else if (superscript.current.checked) {
      newElement = `<sup>${text}</sup>`;
    } else {
      newElement = `<p>${text}</p>`;
    }

    setStyledElement(newElement);
  };

  //When a styled element is set, useEffect is called to call setFinalElement and generate finalElement in GeneratedElement Component
  useEffect(() => {
    if (styledElement) {
      if (link !== "") {
        const linkElement = `<a href='${link}'>${styledElement}</a>`;
        setFinalElement(linkElement);
      } else {
        setFinalElement(styledElement);
      }
    } else {
      setFinalElement("Your Generated HTML Element Will Appear Here");
    }

    setElement("");
    setText("")
    setLink("");
    setNext(""); //Reset steps
  }, [styledElement]);

  return (
    next === "" ? <InnerText onTextChange={onTextChange} text={text} isLink={isLink} setElementText={setElementText} /> :
      next === "Add Link" ? <AddLink onTextChange={onTextChange} text={text} setElementLink={setElementLink} /> :
        <AddStyle normal={normal} bold={bold} italic={italic} strikethrough={strikethrough} underline={underline} 
          subscript={subscript} superscript={superscript} setElementStyle={setElementStyle} />
  );
};