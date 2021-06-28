# App ID Users

## Overview

Sample application which create&list IBM AppID user via API.


## Files

```
|- app.js         : web application for test purpose.
|
|- create_user.js : user import tool.
|
|- list_user.js   : list current users.
|
|- test.csv       : sample csv for import user
```


## How to import user

- Edit test.csv.

  - Each line has to have following 3 items:

    - `user_name,user_email,user_password`

- Run create_user.js.

  - `$ node create_user test.csv`

- Run web application for new user test.

  - `$ node app`


## How to list users

- Run list_user.js.

  - `$ node list_user`


## Copyright

2021 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
