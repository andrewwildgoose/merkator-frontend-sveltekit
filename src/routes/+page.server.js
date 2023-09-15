import { MAPBOX_API_KEY} from '$env/static/private';

export async function load() {
    const mapboxApiKey = MAPBOX_API_KEY;


    return {
        body: {
            mapboxApiKey,

        }
    };
}