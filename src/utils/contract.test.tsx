import { getFirstMasterInception, getLastTerminationDate } from 'utils/contract'

it('getFirstMasterInception returns first master inception if one contract is active', () => {
  const activeContracts = [
    {
      masterInception: '2020-01-01',
    },
  ]
  const firstMasterInception = getFirstMasterInception(activeContracts as any)
  expect(firstMasterInception).toStrictEqual('2020-01-01')
})

it('getFirstMasterInception returns null if one contract is pending', () => {
  const activeContracts = [
    {
      masterInception: null,
    },
  ]
  const firstMasterInception = getFirstMasterInception(activeContracts as any)
  expect(firstMasterInception).toStrictEqual(null)
})

it('getFirstMasterInception returns first master inception if both are active', () => {
  const activeContracts = [
    {
      masterInception: '2020-01-01',
    },
    {
      masterInception: '2020-03-01',
    },
  ]
  const firstMasterInception = getFirstMasterInception(activeContracts as any)
  expect(firstMasterInception).toStrictEqual('2020-01-01')
})

it('getFirstMasterInception returns first master inception in time if first contract is active', () => {
  const oneActiveOnePending = [
    {
      masterInception: '2020-01-01',
    },
    {
      masterInception: null,
    },
  ]
  const firstMasterInception = getFirstMasterInception(
    oneActiveOnePending as any,
  )
  expect(firstMasterInception).toStrictEqual('2020-01-01')
})

it('getFirstMasterInception returns first master inception in time if second contract is active', () => {
  const oneActiveOnePending = [
    {
      masterInception: null,
    },
    {
      masterInception: '2020-01-01',
    },
  ]
  const firstMasterInception = getFirstMasterInception(
    oneActiveOnePending as any,
  )
  expect(firstMasterInception).toStrictEqual('2020-01-01')
})

it('getFirstMasterInception returns null if both contracts are inactive', () => {
  const bothInactive = [
    {
      masterInception: null,
    },
    {
      masterInception: null,
    },
  ]
  const firstMasterInception = getFirstMasterInception(bothInactive as any)
  expect(firstMasterInception).toBe(null)
})

it('getFirstMasterInception returns null if no contract exists', () => {
  const firstMasterInception = getFirstMasterInception([])
  expect(firstMasterInception).toBe(null)
})

it('getLastTerminationDate returns null if one contract is active', () => {
  const terminatedContracts = [
    {
      terminationDate: null,
      isTerminated: false,
    },
  ]
  const lastTerminationDate = getLastTerminationDate(terminatedContracts as any)
  expect(lastTerminationDate).toStrictEqual(null)
})

it('getLastTerminationDate returns last termination date in time if one contract is terminated', () => {
  const terminatedContracts = [
    {
      terminationDate: '2020-03-01',
      isTerminated: true,
    },
  ]
  const lastTerminationDate = getLastTerminationDate(terminatedContracts as any)
  expect(lastTerminationDate).toStrictEqual('2020-03-01')
})

it('getLastTerminationDate returns last termination date in time if second is terminated last', () => {
  const terminatedContracts = [
    {
      terminationDate: '2020-01-01',
      isTerminated: true,
    },
    {
      terminationDate: '2020-03-01',
      isTerminated: true,
    },
  ]
  const lastTerminationDate = getLastTerminationDate(terminatedContracts as any)
  expect(lastTerminationDate).toStrictEqual('2020-03-01')
})

it('getLastTerminationDate returns last termination date in time if first is terminated last', () => {
  const terminatedContracts = [
    {
      terminationDate: '2020-03-01',
      isTerminated: true,
    },
    {
      terminationDate: '2020-01-01',
      isTerminated: true,
    },
  ]
  const lastTerminationDate = getLastTerminationDate(terminatedContracts as any)
  expect(lastTerminationDate).toStrictEqual('2020-03-01')
})

it('getLastTerminationDate returns null first contract is active', () => {
  const oneActiveOneTerminated = [
    {
      isTerminated: false,
    },
    {
      terminationDate: '2020-03-01',
      isTerminated: true,
    },
  ]
  const lastTerminationDate = getLastTerminationDate(
    oneActiveOneTerminated as any,
  )
  expect(lastTerminationDate).toBe(null)
})

it('getLastTerminationDate returns null if both contracts are active', () => {
  const bothInactive = [
    {
      isTerminated: false,
    },
    {
      isTerminated: false,
    },
  ]
  const lastTerminationDate = getLastTerminationDate(bothInactive as any)
  expect(lastTerminationDate).toBe(null)
})

it('getLastTerminationDate returns null if no contract exists', () => {
  const lastTerminationDate = getLastTerminationDate([])
  expect(lastTerminationDate).toBe(null)
})
