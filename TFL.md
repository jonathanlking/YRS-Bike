TFL Cycle Hire API
========================================


###What it Does

A node.js application that supports basic requests for the TFL cycle hire scheme, using the XML file provided by TFL. An asynchronous resquest is made every 3 minutes for the latest data, which is then cached.

###Functionality


Distance to nearest docking station

**returns distance in m (to nearest metre)**

---------------------------------------------

Distance to nearest *available* docking station

**returns distance in m (to nearest metre)**

---------------------------------------------

Nearest stations (specify how many - return 5 by default)

**returns array of TFL station objects**

---------------------------------------------

Nearest stations *available* (specify how many - return 5 by default)

**returns array of TFL station objects**

---------------------------------------------

Stations within ... metres
	
**returns array of TFL station objects**

---------------------------------------------

*Available* stations within ... metres
	
**returns array of TFL station objects**

---------------------------------------------

Station with id
**returns TFL station object with corresponding id**

---------------------------------------------

Spaces availble (specify to dock or to take a bike) for station.
**returns number of spaces**