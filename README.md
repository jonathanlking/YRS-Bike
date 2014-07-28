YRS 2014 Festival of Code - Cycle Routes
========================================


###What it Does

1. Get current location / input start location
2. Choose destination

**It generates a route that has stops every 30 minutes, where you can switch bikes, so that you avoid paying extra.**

###Implementation

1. Find nearest stations near your current location.
2. Find the point on your journey where you will be in the (30 - k)th minute - i.e. when k = 5, the 25th minute.
3. Find the docking stations near that point.
4. Choose the station that;
	+ Takes less than k minutes to get to.
	+ Has free bike docking points.  
	+ Closest to the overall route (you don't want to go out of your way)
5. Repeat - finding directions from the current docking station you have stopped at.

**You must wait 5 minutes before taking another ride. We are making the assumption that you will wait exactly 5 minutes and leave from the same docking station.**

### 'Back End' Usage

Named `process.php`

You pass in the 'to' and 'from' coordinates.

`from_longitude`  
`from_latitude`  
`to_longitude`  
`to_latitude`

**Sample request**

e.g. London Zoo to Big Ben  

`.../process.php?from_longitude=-0.155715844&from_latitude=51.535630782&to_longitude=-0.124572515&to_latitude=51.500645178`

**You can use the start and end point coordinates returned to confirm the request is the latest**

**Response**

	timestamp
	start
		longitude
		latitude
		time
	
	stations (array)
		...
		station
			id (TFL station id)
			name (Map description name)
			longitude
			latitude
			time (When you leave from the station)
			duration (Time between this docking station and the next)
		...
	
	end
		longitude
		latitude
		time

