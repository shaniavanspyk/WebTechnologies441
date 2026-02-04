const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

let state = {}

function startGame() {
    state = {}
    showTextNode(1)
}

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === tetNodeIndex)
    textElement.innerText = textNode.text
    while (optionButtonsElement.firstChild) {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    }

    textNode.options.forEach(option => {
        if (showOption(option)) {
            const button = document.createElement('button')
            button.innerText = option.text
            button.addEventListener('click',() => selectOption(option))
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
    state = Object.assign(state,option.setState) 
    showTextNode(nextTextNodeID)
}

const textNodes = [
    {
        id: 1,
        text: 'you see blue goo',
    options: [
        {
            text:'take goo',
            setState: { BlueGoo: true },
            nextText: 2
        },
        {
            text:'leave the goo',
            nextText: 2
        }
    ]

},
{
    id: 2,
    text: 'venture forthe in search of answers where you come across a merchant.',
    options: [
        {
            text:'trade the good for a sword',
            reqyutedState:(  currentState) => currentState.blueGoo,
            setState: { blueGoo: false, sword: true},
            netText: 3
        },
        { 
            text:'trade the good for a sheild',
            reqyutedState:(  currentState) => currentState.blueGoo,
            setState: { blueGoo: false, sheild: true},
            nextText: 3
        },
        {
            text: 'Ignore the merchant',
            nextText: 3
        }
    ]
},
{ 
    id: 3,
    text: 'text',
    options: [
     { 
        text: 'explore',
        nextText: 3
     },
     {
        text: 'find a place to stay in',
        nextText: 5
     },
     {
        text: 'find a stable with hay to sleep in',
        nextText: 6
     }

    ]
},
{
    id:4,
    text: 'fell asleep and died from a monster',
    options: [
        {
            text: 'Restart',
            nextText: -1
        }
    ]
},
 {
    id: 5,
    text: 'Without any money to buy a room you break into the nearest inn and fall asleep. After a few hours of sleep the owner of the inn finds you and has the town guard lock you in a cell.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
 },
  {
    id: 6,
    text: 'Withou',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
 }
]

startGame()