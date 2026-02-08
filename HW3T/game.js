const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

let state = {}

function startGame() {
  state = {}
  showTextNode(1)
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(node => node.id === textNodeIndex)
  textElement.innerText = textNode.text

  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')   // important for your CSS
      button.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startGame()
  }

  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}

const textNodes = [

  {
    id: 1,
    text: 'You live in Chedderville. The legendary Golden Pizza has gone missing, and without it Cheesepalooza cannot happen. Maestro Cheezo sends you on a quest with a note.',
    options: [
      { text: 'Read the mysterious cheese note', nextText: 2 }
    ]
  },

  // The Mysterious Message
  {
    id: 2,
    text: 'The note is written entirely in cheese. You cannot tell if it is a map, recipe, or grocery list.',
    options: [
      { text: 'Study it carefully', setState: { clue: true }, nextText: 3 },
      { text: 'Wing it confidently', nextText: 3 },
      { text: 'Ask the librarian for help', setState: { librarian: true }, nextText: 3 }
    ]
  },

  // Forest of Garlic Bread
  {
    id: 3,
    text: 'You arrive at the Forest of Garlic Bread. The smell is incredible.',
    options: [
      { text: 'Eat the garlic bread trees', nextText: 10 },
      { text: 'Look for a guide', nextText: 4 },
      { text: 'Shout for the Golden Pizza', nextText: 5 }
    ]
  },

  {
    id: 4,
    text: 'A grumpy squirrel wearing a pizza delivery hat stares at you.',
    options: [
      { text: 'Ask for help politely', nextText: 6 },
      { text: 'Bribe it with crumbs', nextText: 6 }
    ]
  },

  {
    id: 5,
    text: 'You shout dramatically. Nothing happens. Awkward.',
    options: [
      { text: 'Continue forward', nextText: 4 }
    ]
  },

  // Pizza Wizard Tower
  {
    id: 6,
    text: 'You discover the Tower of the Pizza Wizard.',
    options: [
      {
        text: 'Ask the wizard for magical help',
        requiredState: (state) => state.clue || state.librarian,
        setState: { wizardHelp: true },
        nextText: 7
      },
      {
        text: 'Steal a magical topping and run',
        setState: { stolen: true },
        nextText: 7
      }
    ]
  },

  // Final Showdown
  {
    id: 7,
    text: 'You find the Golden Pizza guarded by Captain Mozzarella and his pizza bandits.',
    options: [
      {
        text: 'Negotiate using terrible pizza jokes',
        requiredState: (state) => state.wizardHelp,
        nextText: 8
      },
      {
        text: 'Challenge him to a pizza duel',
        nextText: 9
      },
      {
        text: 'Grab the pizza and run',
        nextText: 11
      }
    ]
  },

  // Good Ending
  {
    id: 8,
    text: 'Your pizza jokes confuse Captain Mozzarella. You throw dough in his face and claim the Golden Pizza. Cheesepalooza is saved. You are crowned The Pizza Hero.',
    options: [{ text: 'Restart', nextText: -1 }]
  },

  // Bad Ending
  {
    id: 9,
    text: 'Captain Mozzarella defeats you with Evil Extra Cheese. Cheesepalooza is canceled. You receive a slice of “just okay” pizza.',
    options: [{ text: 'Restart', nextText: -1 }]
  },

  // Garlic Bread Ending
  {
    id: 10,
    text: 'You eat so much garlic bread that you believe you ARE garlic bread. You wander the forest forever shouting, "I AM GARLIC BREAD!"',
    options: [{ text: 'Restart', nextText: -1 }]
  },

  // Twist Ending
  {
    id: 11,
    text: 'The Golden Pizza is cursed with endless cheese. You save it, but can never eat it. You become a legendary guardian of pizza.',
    options: [{ text: 'Restart', nextText: -1 }]
  }

]

startGame()