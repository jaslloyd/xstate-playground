import React from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import "./App.css";
import StateMachineExample1 from "./SM1";

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
interface StepContext {
  count: number;
}

const stepMachine = Machine<StepContext, StepSchema, StepEvents>({
  id: "stepByStep",
  initial: "one",
  context: {
    count: 0,
  },
  states: {
    one: {
      on: {
        NEXT: {
          target: "two",
          actions: ["incCounter"],
        },
      },
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
  const [current, send] = useMachine(stepMachine, {
    actions: {
      incCounter: assign((context, event) => {
        // send("PREV");
        return {
          count: context.count + 1,
        };
      }),
    },
  });
  const NEXT = () => send("NEXT");
  const PREV = () => send("PREV");

  return (
    <div className="App">
      <h1>XState Playground - Sequence Example</h1>
      {current.context.count}
      {current.matches("one") && <StepOne onNext={NEXT} />}
      {current.matches("two") && <StepTwo onNext={NEXT} onPrev={PREV} />}
      {current.matches("three") && <StepThree onNext={NEXT} onPrev={PREV} />}
      <StateMachineExample1 />
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
