<script>
    import Chart from 'svelte-frappe-charts';

    export let data;
    export let colors;

    let axisOptions = {
        xIsSeries: 1,
        xAxisMode: "tick"
    };

    let lineOptions = {
        hideDots: 1,
        regionFill: 1
        
    };

</script>

<div>
    <Chart data={data} type="line" colors={colors} axisOptions={axisOptions} lineOptions={lineOptions} />
</div>