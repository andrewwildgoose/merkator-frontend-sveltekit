// stores.js
import { writable } from 'svelte/store';

// Functionality to change the unites of measurement
export const units = writable('km');

export const unitsKM = 'km'
export const unitsIMP = 'm'

export const setUnits = (newValue) => {
    units.set(newValue);
}

// Function to delete a route
export async function deleteRoute(routeId, token) {
    const response = await fetch(`http://localhost:3000/merkator/user/route/${routeId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        return {
            success: true,
        };
    } else {
        console.error('Failed to delete route');
    }
}
// Function to delete a trip
export async function deleteTrip(tripId, token) {
    const response = await fetch(`http://localhost:3000/merkator/user/trip/${tripId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        return {
            success: true,
        };
    } else {
        console.error('Failed to delete trip');
    }
}

// Store of the user's routes and trips for quick retrieval
export const userRoutes = writable([]);
export const userTrips = writable([]);

