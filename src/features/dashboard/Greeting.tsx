import { MainHeadline } from '@hedvig-ui'
import React from 'react'

const getDayPartGreeting = (name: string) => {
  const hours = new Date().getHours()
  if (hours >= 0 && hours < 6) {
    return `Good night ${name}! Shouldn’t you be asleep?`
  } else if (hours >= 6 && hours < 12) {
    return `Good morning ${name}! Have a nice day!`
  } else if (hours >= 12 && hours < 18) {
    return `Good afternoon ${name}!`
  } else if (hours >= 18 && hours <= 23) {
    return `Good evening ${name}!`
  }
}

const GREETINGS = (name: string) => ({
  0: `Hi there, ${name}!`,
  1: `Hello, ${name}!`,
  2: getDayPartGreeting(name),
  3: `Welcome again, ${name}!`,
  4: `How do you do, ${name}?`,
})

export const getNameFromEmail = (email: string) => {
  const userName = email.split(/[^\w]/)[0].toLowerCase()
  return `${userName.charAt(0).toUpperCase()}${userName.slice(1)}`
}

export const Greeting: React.FC<{ email: string }> = ({ email }) => (
  <MainHeadline>
    {GREETINGS(getNameFromEmail(email))[Math.floor(Math.random() * 4)]}
  </MainHeadline>
)
