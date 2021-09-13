// Use this file to show what you did in the Dashborad
// We could use the git log or something but i think it's better to do it manually
// since it might be too technical or too much info for a non-techie to take in

import { parseISO } from 'date-fns'

export interface Change {
  date: Date
  change: string
  authorGithubHandle?: string // optional if you're a sucker for praise (and bug reports)
}

export const changelog: ReadonlyArray<Change> = [
  {
    date: '2021-09-13',
    change: 'Added “lucky search” to Member Search',
    authorGithubHandle: 'maxplt',
  },
  {
    date: '2021-08-30',
    change: 'Added code type to campaign codes',
    authorGithubHandle: 'cpiehl1',
  },
  {
    date: '2021-08-18',
    change: 'Add view for viewing and editing employees',
    authorGithubHandle: 'cpiehl1',
  },
  {
    date: '2021-08-16',
    change:
      'Claim notes can be added with a shortcut, and they are added instantly!',
    authorGithubHandle: 'rasmusguterstam',
  },
  {
    date: '2021-08-13',
    change: 'Adjust color-coding for account entries and transactions',
    authorGithubHandle: 'joacimastrom',
  },
  {
    date: '2021-08-10',
    change: 'Disable button to create quotes on locked contracts',
    authorGithubHandle: 'joacimastrom',
  },
  {
    date: '2021-08-05',
    change: 'Allow contract activation and termination in switcher view',
    authorGithubHandle: 'cpiehl1',
  },
  {
    date: '2021-08-03',
    change: 'Allow creation of new campaign partners',
    authorGithubHandle: 'rasmusguterstam',
  },
  {
    date: '2021-07-16',
    change: 'Add status and notes to switcher emails',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-07-09',
    change: 'Locked contracts can no longer be interacted with',
    authorGithubHandle: 'joacimastrom',
  },
  {
    date: '2021-07-06',
    change: 'Allow quote price to be overridden manually',
    authorGithubHandle: 'joacimastrom',
  },
  {
    date: '2021-07-06',
    change: 'Dates are now displayed when chosing contracts in claims',
    authorGithubHandle: 'joacimastrom',
  },
  {
    date: '2021-07-05',
    change: 'Updated the Switcher Tool with more information and market filter',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-07-01',
    change: 'New claim types "Other" and "Duplicate"',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-06-23',
    change: 'Add information about trials',
    authorGithubHandle: 'tobiasbexelius',
  },
  {
    date: '2021-06-17',
    change: 'New travel icons added to perils tool',
    authorGithubHandle: 'fredriklagerblad',
  },
  {
    date: '2021-06-10',
    change: 'Claim types are now searchable and prettier 💅',
    authorGithubHandle: 'rasmusguterstam',
  },
  {
    date: '2021-05-26',
    change:
      "Limit the direct charge amount to only allow it to match the member's current balance",
    authorGithubHandle: 'fredriklagerblad',
  },
  {
    date: '2021-05-26',
    change: 'Send chat messages via Cmd-Enter',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-04-29',
    change: 'Allow access to debt+quote tab when no contracts',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-04-27',
    change: 'Swish claims payouts (feature flagged)',
    authorGithubHandle: 'fredrikareschoug',
  },
  {
    date: '2021-04-23',
    change:
      'Speed up questions tab 🏎, add shortcuts to member suggestions in search, remove Emoji mart ☺',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-04-23',
    change:
      'Better consistency and readability of member information in a claim',
    authorGithubHandle: 'rasmusguterstam',
  },
  {
    date: '2021-04-16',
    change:
      'Allow line breaks and multiple spaces in claim notes 🛸. ' +
      'Also sort payments and claims and some other goodies',
    authorGithubHandle: 'palmenhq',
  },
  {
    date: '2021-04-15',
    change: 'Speed up the claims tab 🏎',
    authorGithubHandle: 'palmenhq',
  },
  {
    date: '2021-04-09',
    change: 'Automatically store who made a claim note, bye bye initials // JP',
    authorGithubHandle: 'palmenhq',
  },
  {
    date: '2021-04-06',
    change:
      'Shortcut fixes! Added search pagination, fix some bugs and improve speed slightly. ',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-03-25',
    change:
      'Shortcuts! Hold OPTION and CTRL to show available shortcuts on a page. Press OPTION and SPACE to open searchable interface. ',
    authorGithubHandle: 'rasmusguterstam',
  },
  {
    date: '2021-03-04',
    change:
      'Add ability to change how many colors are in H.OPE. and other improvements',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-02-24',
    change: 'Show carrier and line of business of a claim.',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-02-12',
    change: 'Added new claim payment types: Expense and Indemnity Cost.',
    authorGithubHandle: 'michael-duivestein',
  },
  {
    date: '2021-02-01',
    change: 'Add amount totals to the claims payment list.',
    authorGithubHandle: 'bystam',
  },
  {
    date: '2021-01-26',
    change: 'Claims list fixes, decrease Dashborad polling interval',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-01-25',
    change: 'Add payout support for Norway',
    authorGithubHandle: 'bystam',
  },
  {
    date: '2021-01-21',
    change: 'Refactor claims list',
    authorGithubHandle: 'rasmusguterstam',
  },
  {
    date: '2021-01-18',
    change: 'Add ability to generate direct debit link for all members',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2021-01-18',
    change: 'Support for identification on claims page for norway',
    authorGithubHandle: 'fredrikareschoug',
  },
  {
    date: '2020-12-04',
    change: 'Add basic support for Danish market',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2020-12-03',
    change: 'Update Questions form and Account Entry form',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2020-12-03',
    change: 'Fix GSR navigation link',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2020-11-24',
    change: 'Add ability to remove a monthly entry from a member',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2020-11-23',
    change:
      'Add ability "monthly entries" to a member\'s account, to be used to automate object insurances',
    authorGithubHandle: 'vonElfvin',
  },
  {
    date: '2020-11-17',
    change:
      'Unsign tool now notifies if the ssn was signed or not on unsigning',
    authorGithubHandle: 'fredrikareschoug',
  },
  {
    date: '2020-10-13',
    change:
      "Use your your keyboard's up and down arrow keys to navigate the member search and claims list",
    authorGithubHandle: 'palmenhq',
  },
  {
    date: '2020-10-13',
    change: 'Add the changelog',
    authorGithubHandle: 'palmenhq',
  },
].map((change) => ({ ...change, date: parseISO(change.date) }))
