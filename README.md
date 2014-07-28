YRS 2014 Festival of Code - Cycle Routes
========================================

###What it Does

1. Get current location / input start location
2. Choose destination

-> A route that has stops every 30 minutes, where you can switch bikes, so that you avoid costs.

###Implementation

1. Find nearest stations near your current location.
2. Find the point on your journey whre you will be in the (30 - k)th minute - ie when k = 5, the 25th minute.
3. Find the docking stations near that point.
4. Choose the station that;
	Takes less than k minutes to get to.
	Has free bike docking points.
	Closest to the overall route (you don't want to go out of your way)
5. Repeat - finding directions from the current docking station you have stopped at.

**You must wait 5 minutes before taking another ride.**
