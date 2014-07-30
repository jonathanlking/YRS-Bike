TFL Cycle Hire API
========================================

###What it Does

A node.js application that supports basic requests for the TFL cycle hire scheme, using the XML data provided by TFL. An asynchronous resquest is made every 3 minutes for the latest data, which is then cached.

Coordinates should be in WGS84 decimal form.

##Functionality

=============================================

Distance to nearest station

**returns distance in m (to nearest metre)**

---------------------------------------------

Distance to nearest *available*  **bikes**

**returns distance in m (to nearest metre)**

---------------------------------------------

Distance to nearest *available*  **docks**

**returns distance in m (to nearest metre)**

=============================================

Nearest stations

`number` is optional - by default will return all stations

`/nearest/stations/?latitude=51.535630782&longitude=-0.155715844&number=10`

**returns array of TFL station objects 5 stations by default**

---------------------------------------------

Nearest stations with *available* **docks**

`/nearest/bikes/?`

**returns array of TFL station objects - 5 stations by default**

---------------------------------------------

Nearest stations with *available* **bikes**

`/nearest/docks/?`

**returns array of TFL station objects - 5 stations by default**

=============================================

Stations within ... metres
	
**returns array of TFL station objects**

---------------------------------------------

Stations with *available* **docks** within ... metres
	
**returns array of TFL station objects**

---------------------------------------------

Stations with *available* **bikes** within ... metres
	
**returns array of TFL station objects**

=============================================

Station with id
**returns TFL station object with corresponding id**

=============================================

Docks available for station.
**returns number of spaces**

---------------------------------------------

Bikes available for station.
**returns number of bikes**
