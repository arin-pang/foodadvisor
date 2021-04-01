# FoodAdvisor Quick Start

## 1. Clone FoodAdvisor

Clone FoodAdvisor

`Path: ./my-projects/`:

```
git clone https://github.com/strapi/foodadvisor.git
```

Navigate to your `./my-projects/foodadvisor` folder by running `cd foodadvisor` from your command line.

## 2. Start Strapi

Naviagte to your `./my-projects/foodadvisor/api` folder by running `cd api` from your command line.

In `./my-projects/foodadvisor/api`, run the following from your command line:

```
yarn && yarn run seed && yarn develop
```

Then, follow [Step 2. Create an admin user](https://strapi.io/documentation/v3.x/getting-started/quick-start.html#_2-create-an-administrator-user) to create an `Administrator`.

You will find more information and options in the [**api** README](./api).

## 3. Start the front-end 

Navigate to your `./my-projects/foodadvisor/client` folder by running `cd client` from your command line.

In `./my-projects/foodadvisor/client`, run the following from your command line:

```
yarn && yarn start
```

You will find more information and options in the [**client** README](./client).


# FoodAdvisor + Capacitor Quick Start
## Run Android Project
```
$ yarn build
$ npx cap sync
$ npx cap open android
```

## Run iOS Project
```
$ yarn build
$ npx cap sync
$ npx cap open ios
```


## Android Code Push
```
appcenter codepush release -a {Owner}/{Android AppName} -d {Stage}  -c android/app/src/main/assets/public -t {Target Version}
```

## iOS Code Push
```
appcenter codepush release -a {Owner}/{iOS AppName} -d {Stage}  -c {NEED_TO_UPDATE} -t {Target Version}
```