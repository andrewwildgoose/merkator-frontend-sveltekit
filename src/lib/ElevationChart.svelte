<script>
    import Chart from 'svelte-frappe-charts';

    export let data;

    let axisOptions = {
        xIsSeries: true
    }

</script>

<div>
    <Chart data={data} type="line" axisOptions={axisOptions}/>
</div>