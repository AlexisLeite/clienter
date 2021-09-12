# Api description

3 collections: clients, orders, updates

## GET

modelName/getDetails:
[Array, of, fields, names]

modelName?perPage=5&sort=fieldA,-fieldB&q=search&page=0
{
  results: [documents],
  statistics: {
    total: 6,
    next: url,
    prev: url,
    first: url,
    last: url
  },
  status: "Success"
}

modelName/:id
{
  results: [document],
  statistics: {
    total: 1,
  },
  status: "Success"
}

## Delete
modelName/:id

## Patch
modelName/:id

## Post
modelName

## On error
{
  status: "error",
  message: "..."
}