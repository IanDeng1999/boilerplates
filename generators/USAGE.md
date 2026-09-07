# Generator usage

Run generators from the project root with `pnpm g`. New action, response, hook,
and helper names are normalized to kebab case. A slash or dot creates nested
directories.

```bash
pnpm g <generator> <name> [arguments]
```

## Action

Generate an action under `api/controllers`. Add required inputs with
`name:type`.

```bash
pnpm g action foo/bar name:string enabled:boolean
# api/controllers/foo/bar.js
```

The generated action uses the project response exits through
`sails.config.http.resposne` and returns `exits.ok({})` as a starting point.

## Response

Generate a response under `api/responses`. Provide a valid three-digit HTTP
status code. The generated response uses the status message as its default
error data and sets its business code to `<status>00`.

```bash
pnpm g response foo 400
# api/responses/foo.js
```

## Helper

Generate a helper under `api/helpers`. Helpers accept the same required
`name:type` inputs as actions.

```bash
pnpm g helper foo/bar isString:boolean
# api/helpers/foo/bar.js
```

## Hook

Generate a custom hook folder under `api/hooks`. Each hook exports an async
`initialize` method that logs when the hook starts.

```bash
pnpm g hook foo
# api/hooks/foo/index.js
```

## Model

Generate a Waterline model under `api/models`. Model fields use either the
default `name` form or `name:type:columnType`.

```bash
pnpm g model foo name:string:varchar(8) age:number:integer enabled:boolean:boolean
# api/models/Foo.js
```

Supported action and helper input types are `string`, `number`, `boolean`,
`json`, and `ref`. Model fields support the same Waterline types.
