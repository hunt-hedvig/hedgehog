import * as React from 'react'

interface Suggestion {
  text: string
  component: React.ReactNode
}

export interface AutocompleteProps {
  suggestions: Suggestion[]
  component: "input" | "textarea"
}

autoHeight
onChange={this.onInputChange}
value={message}
onKeyDown={this.onTextAreaKeyDown}
onKeyPress={this.onTextAreaKeyPress}

export default function Autocomplete({suggestions, component: Component}: AutocompleteProps) {
  let componentProps = {}

  if (Component === "input") {
    componentProps = {
      
    }
  }

  if (Component === "textarea") {
    componentProps = {
      
    }
  }
  
  return (
    <div>
      <Component {...componentProps}/>
    </div>
    <div>
      {suggestions.map(({component: Component, ...suggestionProps}) => {
        return <Component {...suggestionProps}></Component>
      })}
    </div>
  )
}