// stores.js
import { writable } from 'svelte/store';

export const units = writable('km');

export const unitsKM = 'km'
export const unitsIMP = 'm'

export const setUnits = (newValue) => {
    units.set(newValue);
}
