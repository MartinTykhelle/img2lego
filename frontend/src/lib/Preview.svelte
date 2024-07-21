<script>
    import { onMount } from "svelte";
    import { tooltip } from "@svelte-plugins/tooltips";
    import { liveQuery } from "dexie";
    import { db } from "./db";

    let counts = {};
    let legoColors = {};
    let activeLegoImage = {};
    let legoImages = liveQuery(() =>
        db.table("legoImage").orderBy("id").toArray(),
    );
    function colorCode2rgb(colorCode) {
        let returnValue = legoColors[colorCode];
        if (!returnValue) {
            returnValue = { r: 255, g: 255, b: 255 };
        }
        return `rgb(${returnValue.r},${returnValue.g},${returnValue.b})`;
    }

    function colorCode2Name(colorCode) {
        let returnValue = legoColors[colorCode];
        if (!returnValue) {
            returnValue = { name: "White" };
        }
        return returnValue.name;
    }
    function setActive(legoImageId) {
        db.table("legoImage")
            .where("id")
            .equals(legoImageId)
            .last()
            .then((result) => {
                console.log(result);
                activeLegoImage = result;
            });
    }

    onMount(async function () {
        await db
            .table("legoColors")
            .toArray()
            .then((results) => {
                results.map((color) => {
                    console.log(color);
                    legoColors[color.colorCode] = color;
                });
            });
        await db
            .table("legoImage")
            .orderBy("id")
            .last()
            .then((result) => {
                setActive(result.id);
            });
    });
</script>

<div class="flex-container">
    <div class="flex-item">
        {#if $legoImages}
            <ul>
                {#each $legoImages as legoImage (legoImage.id)}
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <li>
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a on:click={() => setActive(legoImage.id)}>
                            &gt;{legoImage.filename}
                        </a>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
    <div class="flex-item center-item">
        {#if activeLegoImage && activeLegoImage.buffer && activeLegoImage.buffer.length > 0}
            <table>
                {#each activeLegoImage.buffer as row, r}
                    <tr>
                        {#each row as cell, c}
                            <td
                                use:tooltip={{
                                    content: `(${r + 1},${c + 1}) ${colorCode2Name(cell)} [${cell}]`,
                                    position: "top",
                                }}
                                ><div
                                    class="color"
                                    style="background-color:{colorCode2rgb(
                                        cell,
                                    )}"
                                ></div></td
                            >
                        {/each}
                    </tr>
                {/each}
            </table>
        {/if}
    </div>
    <div class="flex-item">
        {#if activeLegoImage && activeLegoImage.colorCounts}
            <ul>
                {#each Object.entries(activeLegoImage.colorCounts) as [colorCode, count]}
                    <li>
                        {colorCode2Name(colorCode)}({colorCode}): {count}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>

<style>
    .flex-container {
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: space-around;
        min-height: 600px;
    }
    .flex-item {
        padding: 5px;
        width: 25%;
        max-height: 600px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .center-item {
        width: 50%;
    }

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
    a {
        cursor: pointer;
    }
    ul {
        list-style: none;
        text-align: left;
    }
</style>
