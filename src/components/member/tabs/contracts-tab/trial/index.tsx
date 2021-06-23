import React from 'react'

interface Trial {
  id: string
}

export const TrialComponent: React.FC<{
  trial: Trial
}> = ({ trial }) => {
  return <div>{trial.id}</div>
}
