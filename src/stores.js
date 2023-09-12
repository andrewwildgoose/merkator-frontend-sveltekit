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

// Function to delete a completed trip
export async function deleteCompletedTrip(completedTripId, token) {
    const response = await fetch(`http://localhost:3000/merkator/user/completed_trip/${completedTripId}`, {
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
        console.error('Failed to delete completed trip');
    }
}

// Fetch User Routes
export async function fetchUserRoutes(headers) {
    console.log("Fetching User Routes");
    try {
        // Fetch user's routes from the backend
        const response = await fetch('http://localhost:3000/merkator/user/routes', { headers });
        if (response.ok) {
            const routesStore = await response.json();
            userRoutes.set(routesStore); // Update the store
            console.log("User routes updated:", routesStore);
        } else {
            // Handle error, e.g., unauthorized
            console.error('Failed to fetch user routes');
        }
    } finally {
        console.log("User routes updated")
    }
};

// Store of the user's routes and trips for quick retrieval
export const userRoutes = writable([]);
export const userTrips = writable([]);
export const userCompletedTrips = writable([]);

// RBG to Hex colour converter
export function rgbToHex(red, green, blue) {

    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');

    return `#${redHex}${greenHex}${blueHex}`;
}

