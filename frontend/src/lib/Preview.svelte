<script>
    import { onMount } from "svelte";
    import { tooltip } from "@svelte-plugins/tooltips";
    let legoColors = [];
    let lastUpload = {};
    let counts = {};
    let colors;

    function getCounts() {
        for (let index = 0; index < lastUpload.rawBuffer.length; index++) {
            let colorCode = lastUpload.rawBuffer[index];
            counts[colorCode] = counts[colorCode] ?? 0;
            counts[colorCode]++;
        }
    }

    function colorCode2rgb(colorCode) {
        let returnValue = legoColors.filter((x) => x.colorCode == colorCode)[0];

        return `rgb(${returnValue.r},${returnValue.g},${returnValue.b})`;
    }

    function colorCode2Name(colorCode) {
        let returnValue = legoColors.filter((x) => x.colorCode == colorCode)[0];

        return returnValue.name;
    }
    onMount(async function () {
        legoColors = await (await fetch("/data/legoColors")).json();
        lastUpload = await (await fetch("/data/lastUpload")).json();
        getCounts();
        console.log(counts);
    });
</script>

{#if Object.keys(lastUpload).length > 0}
    <table>
        {#each lastUpload.buffer as row, r}
            <tr>
                {#each row as cell, c}
                    <td
                        use:tooltip={{
                            content: `(${r + 1},${c + 1}) ${colorCode2Name(cell)} [${cell}]`,
                            position: "top",
                        }}
                        ><div
                            class="color"
                            style="background-color:{colorCode2rgb(cell)}"
                        ></div></td
                    >
                {/each}
            </tr>
        {/each}
    </table>
    {#each Object.entries(counts) as [colorCode, count]}
        <div>{colorCode2Name(colorCode)}({colorCode}): {count}</div>
    {/each}
{/if}

<style>
    .color {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin: 0px;
        border-radius: 8px;
    }
    td {
        padding: 0;
        margin: 0;
        line-height: 3px;
    }
    table {
        margin-left: auto;
        margin-right: auto;
    }
</style>
