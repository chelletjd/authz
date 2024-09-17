# Welcome to AuthZ app

This is an authz project implementing [ORY](https://www.ory.sh/)

## Get started

1. Install Dependencies

    ```bash
    npm install
    ```

  2. Start the app

      In two separete terminals run the following commands 

        ```bash
        npm run dev
        ```

        ```bash
        ory tunnel --dev --project <project_id> --workspace <workspace>  http://localhost:3000
        ```

3. To run the test

    ```bash
    npm run test
    ```