<script>
    import Chart from 'svelte-frappe-charts';

    export let data;
    export let colors;

    console.log("data: ", data)
    console.log("colors: ", colors)

    let axisOptions = {
        xIsSeries: 1,
        xAxisMode: "tick"
    };

    let lineOptions = {
        hideDots: 1,
        regionFill: 1
        
    };

</script>

<div class='chart'>
    <Chart data={data} type="line" colors={colors} axisOptions={axisOptions} lineOptions={lineOptions} />
</div>

<style>
    .chart {
        width: 100%;
    }

</style>