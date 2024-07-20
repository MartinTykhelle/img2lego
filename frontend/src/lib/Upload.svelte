<script>
    import { onMount } from "svelte";
    import { tooltip } from "@svelte-plugins/tooltips";
    import { liveQuery } from "dexie";
    import { db } from "./db";
    let colors;
    let image;
    let input;
    let legoColors = liveQuery(() => db.table("legoColors").toArray());

    function onChange() {
        const file = input.files[0];

        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                fetch("/data/legoImage", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        image: reader.result,
                        colors: colors,
                    }),
                });
            });
            reader.readAsDataURL(file);

            return;
        }
    }

    function getColorStr() {
        let enabledColors = [];
        db.table("legoColors")
            .toArray()
            .then(function (records) {
                records.map((record) => {
                    if (record["enabled"]) {
                        enabledColors.push(record["colorCode"]);
                    }
                });
                colors = enabledColors.join(",");
            });
    }

    function colorClick(color, enabled) {
        db.table("legoColors").update(color, { enabled: !enabled });
        getColorStr();
    }

    function disableAll() {
        db.table("legoColors")
            .toCollection()
            .modify((color) => {
                color.enabled = false;
            });
        getColorStr();
    }

    onMount(async function () {
        getColorStr();
    });
</script>

{#if $legoColors}
    {#each $legoColors as color (color.colorCode)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="color"
            class:active={color.enabled}
            on:click={colorClick(color, color.enabled)}
            use:tooltip={{ content: color.name, position: "top" }}
            data-color-code={color.colorCode}
            style="background-color:rgb({color.r},{color.g},{color.b})"
        ></div>
    {/each}
    <input bind:this={input} on:change={onChange} type="file" />
    <!--
    <div bind:this={container}>
        {#if showImage}
            <img bind:this={image} src="" alt="Preview" />
        {:else}
            <span bind:this={placeholder}>Image Preview</span>
        {/if}
    </div>
    
    <form method="post" action="/upload" encType="multipart/form-data">
        <input type="file" accept="image/*" id="myFile" name="filename" />
        <input type="hidden" name="colors" value={colors} />
        <input type="submit" />
    </form>
    -->
    <button on:click={disableAll}>Disable All</button>
{/if}

<style>
    .color {
        display: inline-block;
        width: 32px;
        height: 32px;
        border: 2px solid #ccc;
        margin: 6px;
    }
    .color.active {
        border: 2px solid #f00;
    }
</style>
