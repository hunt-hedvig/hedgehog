## Debugging

### Dependencies

The following dependencies are required:

- NVM: Not necessary, but highly recommended for installing different Node versions
  - https://github.com/nvm-sh/nvm#installing-and-updating
- Node:
  - `nvm install node`
- Yarn:
- `npm install --global yarn`

### Running

- Install project dependencies with `yarn install`.
- Run `hedgehog` with `yarn watch`. This, in theory, should "watch" for changes and hot-deploy new code.
- App is accessible at `localhost:9000`.
- Should you want to test raw queries to `back-office`, use `http://localhost:9000/graphiql`.

## hedgehog, back-office, and schema.graphql

`back-office` and `hedgehog` share the `schema.graphql` file. When altering this file, it should be altered in
`back-office`. The contents of `back-office/schema.graphql` should then be copied to `hedgehog/schema.graphql`. Once
done, do the following:

- Regenerate the GraphQL schema
  - `yarn graphql:gen`
- Get rid of the formatting issues by prettifying:
  - `yarn pretty-quick`
