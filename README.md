# NB-IoT-Simulator

## Overview:
This project simulates an NB-IoT tracker and displays a moving map GUI depicting the movements of an asset-tracking device.

The project was initially too large to port to GitHub (whole directory was over 100 files), so we only included one main file with the maing program logic, which means that there may be issues running this on other devices as there is no CSS, HTML, etc included in this.

## Steps to run:
Need Node.js.

npm install
npm i isomorphic-ws //necessary for WebSocket
npm start //to launch the project

## Explanation of Program Logic:
3 main components:

1) WebSocket:
  
            Used to mimic server/client relationship between NB-IoT & Web Client
  
2) Reverse Geocode service:
  
            Used to turn GPS coordinates into readable addresses for easy asset-management
  
3) Maps service:
  
            Used to constantly display & re-center GUI to show current coordinates
  
  
