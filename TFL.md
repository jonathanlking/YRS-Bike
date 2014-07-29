TFL Cycle Hire API
========================================


###What it Does

A node.js application that supports basic requests for the TFL cycle hire scheme, using the XML file provided by TFL. An asynchronous resquest is made every 3 minutes for the latest data, which is then cached.

###Functionality

Distance to nearest docking station
	nearest available (specify to dock or to take a bike)

Nearest stations (specify how many - return 5 by default)
	nearest available '' ''

Stations within ... metres
	available stations within ... metres

Spaces availble (specify to dock or to take a bike) for station.
