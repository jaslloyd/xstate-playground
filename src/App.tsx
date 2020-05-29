import React from "react";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import "./App.css";

// Schema
interface StepSchema {
  states: {
    one: {};
    two: {};
    three: {};
  };
}

// Events
type StepEvents = { type: "NEXT" } | { type: "PREV" };
// | { type: '' }

// Extended State
interface StepContext {}

const stepMachine = Machine<StepContext, StepSchema, StepEvents>({
  id: "stepByStep",
  initial: "one",
  states: {
    one: {
      on: { NEXT: "two" },
    },
    two: {
      on: { NEXT: "three", PREV: "one" },
    },
    three: {
      on: { PREV: "two" },
    },
  },
});

function App() {
  const [current, send] = useMachine(stepMachine);
  const NEXT = () => send("NEXT");
  const PREV = () => send("PREV");

  return (
    <div className="App">
      <h1>XState Playground - Sequence Example</h1>
      {current.matches("one") && <StepOne onNext={NEXT} />}
      {current.matches("two") && <StepTwo onNext={NEXT} onPrev={PREV} />}
      {current.matches("three") && <StepThree onNext={NEXT} onPrev={PREV} />}
    </div>
  );
}

function StepOne(props: { onNext: () => void }) {
  return (
    <>
      <h1>Step 1</h1>
      <button onClick={props.onNext}>Next</button>
    </>
  );
}

function StepTwo(props: { onNext: () => void; onPrev: () => void }) {
  return (
    <>
      <h1>Step 2</h1>
      <button onClick={props.onPrev}>Prev</button>
      <button onClick={props.onNext}>Next</button>
    </>
  );
}

function StepThree(props: { onNext: () => void; onPrev: () => void }) {
  return (
    <>
      <h1>Step 3</h1>
      <button onClick={props.onPrev}>Prev</button>
      <button onClick={props.onNext}>Next</button>
    </>
  );
}

export default App;
