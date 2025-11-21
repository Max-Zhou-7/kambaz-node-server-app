"use client"
import PassingFunctions from "./PassingFunctions";
import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import EventObject from "./EventObject";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import ParentStateComponent from "./ParentStateComponent";
import ChildStateComponent from "./ChildStateComponent";
import StringStateVariables from "./StringStateVariables";
import ArrayStateVariable from "./ArrayStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import DateStateVariable from "./DateStateVariable";
import ReduxExamples from "./ReduxExamples";


import store from "./store";
import { Provider } from "react-redux";

export default function Lab4() {
  function sayHello() {
    alert("Hello");
  }
  return (
  <Provider store={store}>
    <div id="wd-passing-functions">
      <h2>Lab 4</h2>
       <ReduxExamples />
      <ClickEvent />
      <PassingDataOnEvent />
        <PassingFunctions theFunction={sayHello} />
        <EventObject />
        < Counter />
        <BooleanStateVariables />
        <StringStateVariables />
        <ObjectStateVariable />
        <DateStateVariable />
        <ArrayStateVariable />
        <ParentStateComponent />
        <ChildStateComponent counter={0} setCounter={() => {}} />

    </div>
    </Provider>   
);}
