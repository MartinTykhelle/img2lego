<script>
    import { onMount } from "svelte";
    import { tooltip } from "@svelte-plugins/tooltips";
    import { liveQuery } from "dexie";
    import { db } from "./db";
    let colors;
    let image;
    let files;
    let input;
    let legoColors = liveQuery(() =>
        db.table("legoColors").orderBy("colorCode").toArray(),
    );

    function onChange() {
        const file = files[0];

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
                }).then((response) => {
                    response.json().then((json) => {
                        json.filename = file.name;

                        let counts = {};
                        for (
                            let index = 0;
                            index < json.rawBuffer.length;
                            index++
                        ) {
                            let colorCode = json.rawBuffer[index];
                            counts[colorCode] = counts[colorCode] ?? 0;
                            counts[colorCode]++;
                        }
                        db.table("legoImage").add({
                            filename: json.filename,
                            width: json.width,
                            height: json.height,
                            buffer: json.buffer,
                            colorCounts: counts,
                        });
                    });
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
    <button on:click={disableAll}>Disable All</button>
    <div class="color-container">
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
    </div>
    <input bind:files on:change={onChange} type="file" />
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
{/if}

<style>
    .color-container {
        display: grid;
        grid-template-columns: repeat(17, 1fr);
        grid-gap: 5px;
        margin-left: auto;
        margin-right: auto;
    }
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
