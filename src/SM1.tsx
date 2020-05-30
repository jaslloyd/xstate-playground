import React from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import "./App.css";

// Schema
interface InputSchema {
  states: {
    idle: {};
    typing: {};
    submitting: {};
  };
}

type TypingEvent = { type: "ON_TYPE"; typeText: string };

// Events
type InputEvents = TypingEvent | { type: "ON_BLUR" };
// | { type: '' }

// Extended State
interface StepContext {
  text: string;
}

const inputMachine = Machine<StepContext, InputSchema, InputEvents>({
  id: "stepByStep",
  initial: "idle",
  context: {
    text: "REPLACE_ME",
  },
  states: {
    idle: {
      on: {
        ON_TYPE: {
          target: "typing",
          actions: ["changeText"],
        },
      },
    },
    typing: {
      on: {
        ON_TYPE: {
          target: "typing",
          actions: ["changeText"],
        },
      },
    },
    submitting: {},
  },
});

function StateMachineExample1() {
  const [current, send] = useMachine(inputMachine, {
    actions: {
      changeText: assign<StepContext, any>((context, event) => ({
        text: event.typeText,
      })),
    },
  });

  return (
    <div className="App">
      <h1>XState Playground - Sequence Example</h1>
      <div className="text">{current.context.text}</div>
      <input
        type="text"
        onChange={(e) => send({ type: "ON_TYPE", typeText: e.target.value })}
        onBlur={(_) => send("ON_BLUR")}
      />
    </div>
  );
}

export default StateMachineExample1;
