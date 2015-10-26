
## Minder 
Like Tinder, but for music.

## Target Audience
People who want to go see concerts in their area but want to find/meet people to go with.  

## Problem
Often when someone moves, is travelling, or friends do not have similar music tastes, it is hard to find people to go to concerts. By creating a simple way to find people that want to go to the same shows we can alleviate a lot of the stress around going to a show alone.  

## Requirements
We will maintain a user database using Node.js and the Express framework. Each client will interact with the database via AJAX requests to retrieve information on concerts and matching results. We also hope to interface with the soundkick API to collect information on shows near each client.
### Database
Will contain all personal information of each user including things like:  
1. Name  
2. Location  
3. Concerts they want to attend  
4. Chat data  

Using this information we will be able to design a matching system based off of what shows people select and where they live.
## Uniqueness
There are plenty of sites to find concerts, and they all have a user system, but we could not find a website that was meant to bring people together with similar music taste.  

## Feature Overview
1. User system.
2. Geolocation based concert feed (Using SongKick API).
3. Geolocation based matching system.
4. Chat system.
