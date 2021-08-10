# Test
test is a Node Simple Fintech APP for dealing with Funds transfer.

## Installation

Use the package manager [yarn](https://classic.yarnpkg.com/en/docs/install) to install dependencies.

```bash
yarn install
```

## Usage

```
#routes 'register'
POST /auth/register
{
  name: string,
  email: string,
  password: string
}

POST /auth/login
{
  email: string,
  password: string
}
GET /accounts/:id/balance

PUT /accounts/:id/fund
{
 amount: number
}

PUT /accounts/:id/transfer
{
 amount: number,
 recipient_id: string
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)