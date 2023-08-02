<script>

    import { units } from '../stores';

	let trips = [
    { tripName: 'NC500', tripDescription: '5 day trip around the highlands', tripLegs: ['leg 1', 'leg 2', 'leg 3', 'leg 4', 'leg 5'], tripLength: 800, id: 1 },
    { tripName: 'Benelux Tour', tripDescription: 'Couple days with no hills!', tripLegs: ['leg 1', 'leg 2', 'leg 3'], tripLength: 300, id: 2 },
    { tripName: 'LEJOG', tripDescription: 'the bottom to the top', tripLegs: ['leg 1', 'leg 2', 'leg 3', 'leg 4', 'leg 5', 'leg 6', 'leg 7'], tripLength: 1000, id: 3 }
    ];

    // delete trip handler
    const handleClick = (e, id) => {
    trips = trips.filter(trip => trip.id != id);
    console.log(e);
    };
</script>

<div class="tripsListFeed">
    <h1>Trips</h1>
    {#each trips as trip (trip.id)}
    <div class = 'centre'>
        <h4>{trip.tripName}</h4>
        <p>{trip.tripLength} {$units}<br>{trip.tripDescription}</p>
        <p>{trip.tripLegs}</p>
        <button on:click={(e) => handleClick(e, trip.id)}>delete trip</button>
    </div>
	<br>
    {:else}
    <p>There are no trips to show...</p>
    {/each}
</div>
	
	

<style>
	.tripsListFeed {
        text-align: center;
    }
    .centre {
        text-align: center;
        border-radius: 2px;
        border: 2px solid rgba(38, 214, 150, 0.1);
        margin: auto;
        width: 50%;
        padding: 10px;
    }
</style>