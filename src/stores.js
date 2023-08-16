// stores.js
import { writable } from 'svelte/store';

export const units = writable('km');

export const unitsKM = 'km'
export const unitsIMP = 'm'

export const setUnits = (newValue) => {
    units.set(newValue);
}

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
