# Custom JSON Web Token Auth

## Similar to Brad Traversy's JWT video -- we can split the authorization header in order go get the jwt.
- ### This is the result of req.headers being logged to the terminal. Recall that for the POST protected route, req.headers is defined by the client that is making the request to our backend. In Postman, we specified the authorization header with the token that we got from the POST register route.
```
{
  authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyNzc4MjY4MzMzNiwiZXhwIjoxNjI3NzgyNzY5NzM2fQ.ge34nA4QO34VPZxUneooWz0Kj2o2_APyKbT6NtOTUH5yS_4yucBOp4o_G63vKamrzJ17yWhHEoP-cl-X92MYWjclVfzJr3_l9TxaEoOKU029wA-xI6NxEVuXPtypuMC71XqZgLhlw_c9yEs7hQuHYJdJGgYfEiEw3A_5Fqk7_KtjN-LYE5saENVOfeFkocwD0z4x7xCfdhB4pobgjSWlbUityt3Q9kvmJOx-sxPF6WjnDk0T2WkK2TBKCb-2l5IWsThLr9SvFlZY-q3OIjnahDMDw0BjTkYe6Elljfcq8oTQIHzd9p0ntn1P5zzzqIX5h0gBz7uh3Lia1SQfhspxhc0AZYR6mkfHpNI1_JN6aleXkiOJanTrWnYLy-AZU8cnXKeCAuSMIq-NLmnJjD---zOSkzwfp9b6ifc09AsRahns0kCYi-KUlnu0BfBqhBCmODO0qGdnqj08GMngFoEABeDE2F-KLH6T3fujyI4ATKiam5ZQtmB2cBM0WHK1SosOcc7GhOgR1yIfs0x5JodRofiu1iuCKtYqnH9jJ2S0P7xhSuiHzElmTNgazDgVsUCOUrUwDJSA0U25ICBNbFzLhmXkB1dvO0HLAV2KkLpkD-4R-PzPBlRgvs3raZF2vdeB1TUEpx-wGuLzF4aTXcceqnnJmvlsQA_lwZj_Vzkwf7g',
  'content-type': 'application/json',
  'user-agent': 'PostmanRuntime/7.28.2',
  accept: '*/*',
  'postman-token': 'adfbf54b-e81c-4a26-b61f-806c61dd532b',
  host: 'localhost:8080',
  'accept-encoding': 'gzip, deflate, br',
  connection: 'keep-alive',
  'content-length': '72'
}
```

- ### This the result of splitting our token into two parts.
`const tokenParts = req.headers.authorization.split(' ');`

```
[
  'Bearer',
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyNzc4MjY4MzMzNiwiZXhwIjoxNjI3NzgyNzY5NzM2fQ.ge34nA4QO34VPZxUneooWz0Kj2o2_APyKbT6NtOTUH5yS_4yucBOp4o_G63vKamrzJ17yWhHEoP-cl-X92MYWjclVfzJr3_l9TxaEoOKU029wA-xI6NxEVuXPtypuMC71XqZgLhlw_c9yEs7hQuHYJdJGgYfEiEw3A_5Fqk7_KtjN-LYE5saENVOfeFkocwD0z4x7xCfdhB4pobgjSWlbUityt3Q9kvmJOx-sxPF6WjnDk0T2WkK2TBKCb-2l5IWsThLr9SvFlZY-q3OIjnahDMDw0BjTkYe6Elljfcq8oTQIHzd9p0ntn1P5zzzqIX5h0gBz7uh3Lia1SQfhspxhc0AZYR6mkfHpNI1_JN6aleXkiOJanTrWnYLy-AZU8cnXKeCAuSMIq-NLmnJjD---zOSkzwfp9b6ifc09AsRahns0kCYi-KUlnu0BfBqhBCmODO0qGdnqj08GMngFoEABeDE2F-KLH6T3fujyI4ATKiam5ZQtmB2cBM0WHK1SosOcc7GhOgR1yIfs0x5JodRofiu1iuCKtYqnH9jJ2S0P7xhSuiHzElmTNgazDgVsUCOUrUwDJSA0U25ICBNbFzLhmXkB1dvO0HLAV2KkLpkD-4R-PzPBlRgvs3raZF2vdeB1TUEpx-wGuLzF4aTXcceqnnJmvlsQA_lwZj_Vzkwf7g'
]
```

# We must check our incoming authorization header to format to make sure we are not granted unauthorized access to routes
- ### We know that the first part of authorization header should have the word Bearer in it.
- ### The second part of our header should match a specific regular expression where there is some text, a period, more text, a period, and finally..more text.
- ### This is the header, payload, signature format of JWT.

```
if(tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null)
```
# Custom Auth Middleware Function | We are using JWT under the hood just like passport would.
- ## Notice how we are passing down a property to all other routes by appending the verification value to the request object.
```
function customAuthMiddleware(req, res, next) {
    // const tokenParts = req.headers.authorization.split(' ');
    const [bearer, jsonToken] = req.headers.authorization.split(' ');
    if(bearer === 'Bearer' && jsonToken.match(/\S+\.\S+\.\S+/) !== null) {
        try {
            const verification = jwt.verify(jsonToken, PUB_KEY, { algorithms: ['RS256'] });
            req.jwt = verification;
            next();
        }catch(err){
            res.status(401).json({ msg: "you are not authorized to visit this route" });
        }
    }
}
```

## If validation is successful we should get an object. If it is unsuccessful, we get an error.
```
{ sub: 1, iat: 1627782683336, exp: 1627782769736 }
```

## We should now have access to req.jwt in every other route handler after the first one with customAuthMiddleware.