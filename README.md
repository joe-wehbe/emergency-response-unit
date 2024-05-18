<p align="center"><img src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/868cacf0-b2b8-456f-aa56-5cf71ed764ae"></p>

# Emergency Response Unit
This project was completed for the Capstone Project (CSC599) course at the <a href="http://www.lau.edu.lb/">Lebanese American University</a>. It is a proposed idea to LAU's Emergency Response Unit to develop a mobile application that facilitates operational management within the unit and improves the process of handling on-campus medical emergencies from the moment they are reported till they are resolved.

# Application Preview
|Login|Side Menu|Report Emergency|
|-------|---------|--------------|
|<img height="600" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/009aef38-e6f8-4e05-bc1a-85ae9261f958">|<img height="600" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/cdcf6a61-2cb5-4b1e-a853-f703390b1f1f">|<img height="600" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/ff6dab8e-7e5b-4602-bf01-0406c28aa78f">|

|Standby|Emergency Details|Community|
|-------|---------|--------------|
|<img height="600" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/af3d53c4-abdb-473e-bf3f-2ce34037eae5">|<img height="600" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/1d8ad6c8-8f27-44c1-bfad-b3b43f13dcf1">|<img height="600" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/c8c4fe7a-c39c-4d9a-8100-3c4c4f0fd324">|

|Community (Dark Mode) |Extensions (Dark Mode) |Medical FAQs (Dark Mode)|
|-------|---------|--------------|
|<img height="600" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/8bb4350c-1c00-4120-a0ae-ba806c15650e">|<img height="600" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/56cb5cee-daff-4f53-9e0c-2d670c5e554a">|<img height="600" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/81ddf66c-c7c4-450e-be5d-8b3713ca3119">|

# How to run the project
## Setting up the project
Download xampp and start `MySQL` and `Apache`:
```
https://www.apachefriends.org/download.html
```

Clone the repository
```
git clone https://github.com/joe-wehbe/emergency-response-unit.git
```

Navigate to the backend folder, install necessary packages and dependencies, then run the backend server
```
cd Backend
```
```
composer install
```
```
composer require barryvdh/laravel-dompdf
```
```
php artisan serve
```

Migrate the database tables
```
php artisan migrate
```

Navigate to the frontend folder, install necessary packages and dependencies
```
cd Frontend
```
```
npm install
```
```
npm install @capacitor/core
```
```
npm install @capacitor/cli
```
```
npm install @capacitor/push-notifications
```

## Running the project in a browser
To run the project in a browser (FCM not supported)
```
ionic serve
```

## Running the project in an emulator (android)
Firebase push notifications (FCM) require an emulator since it is a native functionality. Download android studio and an emulator:
```
https://developer.android.com/
```
In the frontend directory, run:
```
ionic build
```
```
npx cap sync
```
```
npx cap run android
```

# Stacks & Technologies
|Frameworks|Languages|Databases|Third-party|Other tools|
|----------|---------|---------|-----------|-----------|
|<img width="55" src="https://github.com/joe-wehbe/emergency-response-unit/assets/102875229/641334fc-6c12-449c-8da8-a252bb4a90dc"> [![My Skills](https://skillicons.dev/icons?i=laravel)](https://skillicons.dev)|[![My Skills](https://skillicons.dev/icons?i=typescript,html,css,php)](https://skillicons.dev)|<img align="center" src="https://skillicons.dev/icons?i=mysql">|[![My Skills](https://skillicons.dev/icons?i=firebase)](https://skillicons.dev)|[![My Skills](https://skillicons.dev/icons?i=github,git,figma)](https://skillicons.dev)|

# Contributors
<a href = "https://github.com/joe-wehbe"><img src = "https://contrib.rocks/image?repo=joe-wehbe/csc498g"/></a>
<a href = "https://github.com/roulaaa"><img src = "https://contrib.rocks/image?repo=roulaaa/roulaaa"/></a>
<a href = "https://github.com/TheresaRoukaibe"><img src = "https://contrib.rocks/image?repo=TheresaRoukaibe/TheresaRoukaibe"/></a>

