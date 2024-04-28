# Skin Trade App
### Web app build with django and react.

![image](https://github.com/Orest-Maiatskyi/SkinTradeApp/assets/64983071/32854e73-f8ff-44bd-b34d-067349d27e02)
___

This web application was made to implement the basic functions of sites 
selling skins (<b>in this case, only skins from CSGO</b>).

<b>The following functions were implemented:</b> 
1. Registration and login of the user using Steam OpenId.
2. Loading of the user's CSGO inventory (if it is publicly available).
3. Display of fake balance (<b>The trading system is not made, a stub is used, 
[about which below](#about--trading-stub-)</b>).
4. Fake skin sale (<b>The trading system is not made, a stub is used, 
[about which below](#about--trading-stub-)</b>).

![image](https://github.com/Orest-Maiatskyi/SkinTradeApp/assets/64983071/eb5306ac-8eaf-4f76-92d0-8256dcb1309f)
![image](https://github.com/Orest-Maiatskyi/SkinTradeApp/assets/64983071/ee08a135-b6fa-4748-a503-8744cbe4f32b)

### How To Run ?
___

First, about the backend, django is used, requirements.txt is attached.
Install all dependencies, change the settings.py file (you must specify the MYSQL database configuration), 
make the migration as follows:
1. python manage.py makemigrations
2. python manage.py migrate
   
Also you need redis server running.

To start the frontend, you need a [Vite](https://vitejs.dev/) builder, [use these instructions if necessary](https://vitejs.dev/guide/).

### About "Trading Stub"
___


This web application does not implement the function of interacting with trade bots and transferring money. 
For a visual example, a “stub” was created.
The meaning of the “stub” is simple: When you try to sell a skin, 
the application adds data to the database that a specific user sold a specific item, 
and a fake balance is also added. When you try to sell the same item again, an error is thrown, 
and “sold” items are not displayed in the user’s profile.
