theme: Work, 3
# [fit] Componentizing
# [fit] Application
# [fit] State

---

![left](chicken.jpg)

# [fit] A little about me

## [fit] Nick Nisi

- Staff Engineer at C2FO
- Organizer and Emcee of NEJS Conf (2015-2019)
- Emcee of TypeScript Conf US
- Panelist on JS Party

> I like JavaScript and TypeScript a lot.
> React is cool, too.

---

# [fit] Your application state is
# [fit] too complex

---

# [fit] #TMTOWTDI

## [fit] *There's more than one way to do it*

---

# [fit] The Quiz Show


##### JS Danger: CSS Tricks Edition - https://youtu.be/qDox5IVw74E

![fit left](jsdanger.png)

![](dojo.png) Originally built with Dojo and Dojo Stores for application state
![](react.png) Rewritten in React

### [fit] The original used Dojo stores for application state management.
### [fit] 🤔 What should we use with React?

---

# The Context Way

```js
export interface State {
  style: 'jsDanger' | 'goTime';
  players: Player[];
  rounds: Round[];
  currentQuestion: Question;
}

export const GameContext = createContext<null | State>(null);

export const GameProvider = ({ initialState, children }: GameProviderProps) => (
  <GameContext.Provider value={initialState}>{children}</GameContext.Provider>
);
```

> It's a good idea, but it lacks any real structure for dealing with the state object.

---

# Redux

```ts
function gameReducer(state = { gameStyle: 'jsParty' }, action) {
  switch (action.type) {
    case 'game/setStyle':
      return { gameStyle: action.payload }
    // ...
    default:
      return state
  }
}

const store = createStore(counterReducer);
store.dispatch({ type: 'game/setStyle', payload: 'goTime' });
```

---

# Some drawbacks of something like Redux

- While there's more structure, there's still a lot of ways to hurt yourself
    - infinite states
    - impossible states
- Can be difficult to visualize what's going on, as a whole
    - Especially as the app gets bigger

> there are tools and frameworks to work within to make this easier

---

# XState

[.column]

```ts
export const gameMachine = createMachine<GameMachineContext, GameMachineEvent>(
  {
    states: {
      game: {
        states: {
          question: {
            on: {
              TOGGLE_CONTESTANTS: 'contestants',
              SHOW_ANSWER: {
                target: 'answer',
                actions: assign({
                  currentQuestion: (_context) => undefined,
                }),
              },
            },
          },
          answer: { /* ... */ },
        },
      },
    },
  },
);
```

[.column]

- Finite states
- Infinite states handled as private context (such as number of questions in a game)
- Side-effects are declarative and explicit

---

# [fit] Other Benefits of XState

- Framework agnostic
    - Take it with you anywhere
    - Declarative configuration is easy to follow along
- Define transitions that work in specific states only
- State machines can invoke and send messages to other state machines
    - Break up your application logic how it makes sense for you

---

[.column]

```ts
const lightMachine = createMachine({
  // Machine identifier
  id: 'light',

  // Initial state
  initial: 'green',

  // Local context for entire machine
  context: {
    elapsed: 0,
    direction: 'east'
  },

  // State definitions
  states: {
    green: {
      /* ... */
    },
    yellow: {
      /* ... */
    },
    red: {
      /* ... */
    }
  }
});
```

[.column]

- The finite states that a machine can be in are defined as `states`.
- Any *infinite* states / context you need to control is defined as a `context` object 

---

# Now let's talk about
# [fit] React components

React makes it really easy to create declarative UIs easily

[.column]

```js
export const Game = () => {
  return (
    <div className="game">
      <Player name="nick" />
      {/* ... */}
    </div>
  )
}
```

[.column]

```js
export const Player = ({ name }: PlayerProps) => (
  <div>
    <img src={`${name}.bmp`} />
    <div className="name">{name}</div>
  </div>
)
```

---

# [fit] Developing UIs

- Working with declarative UI is fast and fun
    - Define inputs (props) and outputs (the rendered markup)
- Build a harness page to test the components by themselves without needing to spin up the entire app

---

# [fit] Storybook

Storybook is a tool to build components faster

- Build components outside of your app, in isolation
- Control the data passed to the components and how they're rendered
- Streamline UI development and testing

---

![](contestant.gif)

---

# [fit] What if we could do this
# [fit] with our
# [fit] application state?

---

# [fit] An app flow example

![inline](miro.png)

---

# [fit] Componentizing Application State

- Treat the app state as just another component
- Work on the state of the application and verify its flow **BEFORE** the UI components exist
- Walk through the flow with non-technical stakeholders

---

# [fit] State machines render to state charts

- A visual representation of what's happening in state
- Every state, action, and path clearly(?) noted in one, easy-to-view diagram
- The diagram is directly generated from the code, so it's always up-to-date (sorry, Miro)
- Useful debugging tool as the state updates to reflec the current state of the application

![right](gameMachine.png)

---

# Your state becomes a component

- Render state charts directly from the actual application flow
- Walk through the state and verify all possible routes from one state to another
- Walk through entire application flow before the UI exists
- Do all of this in Storybook

<br>

```bash
npm install storybook-xstate-addon
```

---

# Building a state machine

Each state machine is made up of the following primary pieces:

- Context
- States
- Events

---

# Context

This is the data that you'd like the state machine to store.

[.column]

- Infinite states
- General/supplemental data about the states
- The data that cannot be coded into the machine itself


[.column]

```ts
export interface GameMachineContext {
  name: string;
  style: GameStyle;
  currentRound: number;
  currentContestant?: Player | null;
  contestants: Player[];
  pointsAtStake: number;
  currentQuestion?: {
    category: Category;
    question: Question;
  };
  rounds: Round[];
  winner?: Player;
  url: string;
}
```

---

# States

The `states` represent the current and future states of the machine.

[.column]


```ts
states: {
  load: { /* ... */},
  game: {
    states: {
      idle: { /* ... */ },
      question: { /* ... */ },
      contestants: { /* ... */ },
    }
  }
}
```

[.column]

- Defines the states of the application and each action that can occur while in that state
- This is the _finite_ part of FSM

---

# Events

Events are all of the possible actions that can occur while in a particular state

[.column]

- If an event isn't defined for the current state, it's quietly ignored by the state machine
- Define a finite list of actions that can occur on each state
- Full control

[.column]

```ts
question: {
  states: {
    default: {
      on: {
        TOGGLE_ANSWER: { target: 'showAnswer' },
      },
    },
    showAnswer: {
      on: {
        TOGGLE_ANSWER: { target: 'default' }
      }
    }
  }
}
```

---

# Events are fully-typed and can have payloads

> An example _discriminated union_ event type

```ts
export type GameMachineEvent =
  | {
      type: 'SELECT_QUESTION';
      data: {
        question: Question;
        category: Category;
      };
    }
  | { type: 'TOGGLE_ANSWER' | 'TOGGLE_CONTESTANTS' | 'CLOSE_QUESTION' }
  | { type: 'SET_ROUND'; data: { round: number } }
  | { type: 'SET_WINNER'; winner: Player | undefined }
  | { type: 'INCREMENT_SCORE' | 'DECREMENT_SCORE'; handle: string; value: number }
  | { type: 'SET_CURRENT_CONTESTANT'; data: { contestant: Player } };
```

---

# [fit] States and Events
# [fit] rendered to a state chart

[.column]

![fit](events.png)

[.column]

```ts
question: {
  states: {
    default: {
      on: {
        TOGGLE_ANSWER: { target: 'showAnswer' },
      },
    },
    showAnswer: {
      on: {
        TOGGLE_ANSWER: { target: 'default' }
      }
    }
  }
}
```

---

![fit](fsm1.png)

---

![fit](fsm2.png)

---

![fit](fsm3.png)

---

![fit](fsm4.png)

---

# Putting it all together

![](full-state-machine.png)
![fit](full-state-machine.png)

---

# [fit] Let's look at
# [fit] some code

---

# [fit] Wrapping Up

- https://xstate.js.org
- https://github.com/nicknisi/quiz-show
- https://storybook.js.org/addons/storybook-xstate-addon
<br>

> Treating your application state like a component is easy and fun with XState and Storybook!

---

# [fit] THANKS

![](https://media.giphy.com/media/l3q2wJsC23ikJg9xe/giphy.gif)
